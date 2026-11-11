"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error: string } | void;

function isMinor(dob: string): boolean {
  const birthDate = new Date(dob);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return birthDate > eighteenYearsAgo;
}

export async function registerAction(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const dob = String(formData.get("dob") ?? "");
  const country = String(formData.get("country") ?? "").trim();
  const parentName = String(formData.get("parent_name") ?? "").trim();
  const parentEmail = String(formData.get("parent_email") ?? "").trim();
  const parentPhone = String(formData.get("parent_phone") ?? "").trim();
  const acceptedAll = formData.get("accept_terms") === "on";

  if (!fullName || !email || !password || !dob || !country) {
    return { error: "Please fill in all required fields." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!acceptedAll) {
    return { error: "You must accept the Terms, Privacy Policy, and Liability Waiver." };
  }
  if (isMinor(dob) && (!parentName || !parentEmail)) {
    return { error: "Parent/guardian name and email are required for goalkeepers under 18." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const now = new Date().toISOString();
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        dob,
        country,
        parent_name: parentName || null,
        parent_email: parentEmail || null,
        parent_phone: parentPhone || null,
        accepted_terms_at: now,
        accepted_privacy_at: now,
        accepted_waiver_at: now,
      })
      .eq("id", data.user.id);
  }

  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect(next || "/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
