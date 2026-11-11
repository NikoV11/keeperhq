import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  gk_age: z.coerce.number().int().min(4).max(80).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  club_school: z.string().trim().max(200).optional().nullable(),
  playing_level: z.string().trim().max(200).optional().nullable(),
  interest: z
    .enum(["bronze", "silver", "gold", "game_analysis", "sc", "free_trial", "general"])
    .optional()
    .nullable(),
  message: z.string().trim().min(1).max(5000),
  source: z.enum(["contact_page", "chat_widget"]),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    user_id: user?.id ?? null,
    name: data.name,
    email: data.email,
    gk_age: data.gk_age ?? null,
    country: data.country || null,
    club_school: data.club_school || null,
    playing_level: data.playing_level || null,
    interest: data.interest ?? "general",
    message: data.message,
    source: data.source,
  });

  if (error) {
    return NextResponse.json({ error: "Couldn't save your message." }, { status: 500 });
  }

  await sendNotificationEmail(data);

  return NextResponse.json({ ok: true });
}

async function sendNotificationEmail(data: z.infer<typeof schema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "KeeperHQ <onboarding@resend.dev>",
      to,
      replyTo: data.email,
      subject: `New KeeperHQ enquiry from ${data.name}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `GK age: ${data.gk_age ?? "—"}`,
        `Country: ${data.country ?? "—"}`,
        `Club/school: ${data.club_school ?? "—"}`,
        `Playing level: ${data.playing_level ?? "—"}`,
        `Interest: ${data.interest ?? "general"}`,
        `Source: ${data.source}`,
        "",
        data.message,
      ].join("\n"),
    });
  } catch {
    // The message is already persisted; a failed notification must not fail the request.
  }
}
