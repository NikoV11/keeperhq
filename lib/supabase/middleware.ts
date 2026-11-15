import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // No backend yet: skip the auth round-trip so public pages still serve. Protected
  // routes below would have no session to find anyway.
  if (!isSupabaseConfigured) {
    return response;
  }

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isDashboard = path.startsWith("/dashboard");
  const isCoach = path.startsWith("/coach");
  const isAdmin = path.startsWith("/admin");

  if (!user && (isDashboard || isCoach || isAdmin)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (isCoach || isAdmin)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowed = isAdmin ? ["admin"] : ["coach", "admin"];
    if (!profile || !allowed.includes(profile.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}
