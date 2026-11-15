import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  SEED_TESTIMONIALS,
  SEED_TEAM,
  SEED_PACKAGES,
  SEED_SC_PROGRAMS,
  SEED_LEGAL,
  SEED_SITE_TEXT,
  SEED_OPERATING_HOURS,
} from "@/content/preview-seed";

// Shapes mirror the tables created in 0005_editable_content.sql.
export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role_title: string;
  short_bio: string | null;
  photo_path: string | null;
  cv_path: string | null;
  cal_username: string | null;
  languages: string[];
  sections: { heading: string; body: string }[];
  sort_order: number;
  published: boolean;
};

export type TestimonialCategory = "goalkeeper" | "coach" | "parent";

export type Testimonial = {
  id: string;
  kind: "video" | "written";
  category: TestimonialCategory;
  name: string;
  slug: string | null;
  affiliation: string | null;
  age: number | null;
  /** Career/background bullet points shown above the quote. */
  profile: string[];
  quote: string | null;
  /** Set when a testimonial was supplied in another language as well. */
  quote_original: string | null;
  quote_original_language: string | null;
  photo_path: string | null;
  video_path: string | null;
  thumbnail_path: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type LegalDocument = {
  slug: string;
  title: string;
  body: string;
  sort_order: number;
};

export type MembershipPackage = {
  key: "bronze" | "silver" | "gold";
  name: string;
  price_display: string;
  price_note: string;
  evaluation_note: string | null;
  features: string[];
  featured: boolean;
  sort_order: number;
};

export type SCProgramRow = {
  key: string;
  title: string;
  focus: string | null;
  price_display: string | null;
  category: "program" | "bundle" | "custom";
  sort_order: number;
  published: boolean;
};

export type OperatingHours = { summary: string; timezone: string; note: string };
export type SiteText = {
  tagline: string;
  hero_description: string;
  cta: string;
  contact_email: string;
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured) return SEED_TEAM;
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data as TeamMember[]) ?? [];
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  if (!isSupabaseConfigured) return SEED_TEAM.find((m) => m.slug === slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as TeamMember) ?? null;
}

export async function getTestimonials(filters?: {
  kind?: "video" | "written";
  category?: TestimonialCategory;
}): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) {
    return SEED_TESTIMONIALS.filter(
      (t) =>
        (!filters?.kind || t.kind === filters.kind) &&
        (!filters?.category || t.category === filters.category)
    );
  }
  const supabase = await createClient();
  let query = supabase.from("testimonials").select("*").eq("published", true);
  if (filters?.kind) query = query.eq("kind", filters.kind);
  if (filters?.category) query = query.eq("category", filters.category);
  const { data } = await query.order("sort_order");
  return (data as Testimonial[]) ?? [];
}

/**
 * "Goalkeepers We Have Worked With" is the goalkeeper slice of the testimonials
 * table — the same person is both a track-record card and a testimonial, so the
 * owner only maintains one entry.
 */
export function getGoalkeepers() {
  return getTestimonials({ category: "goalkeeper" });
}

export async function getLegalDocuments(): Promise<LegalDocument[]> {
  if (!isSupabaseConfigured) return SEED_LEGAL;
  const supabase = await createClient();
  const { data } = await supabase.from("legal_documents").select("*").order("sort_order");
  return (data as LegalDocument[]) ?? [];
}

export async function getLegalDocument(slug: string): Promise<LegalDocument | null> {
  if (!isSupabaseConfigured) return SEED_LEGAL.find((d) => d.slug === slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as LegalDocument) ?? null;
}

export async function getPackages(): Promise<MembershipPackage[]> {
  if (!isSupabaseConfigured) return SEED_PACKAGES;
  const supabase = await createClient();
  const { data } = await supabase.from("membership_packages").select("*").order("sort_order");
  return (data as MembershipPackage[]) ?? [];
}

export async function getSCPrograms(): Promise<SCProgramRow[]> {
  if (!isSupabaseConfigured) return SEED_SC_PROGRAMS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sc_programs")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data as SCProgramRow[]) ?? [];
}

async function getConfig<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured) return fallback;
  const supabase = await createClient();
  const { data } = await supabase.from("app_config").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

export function getOperatingHours() {
  return getConfig<OperatingHours>("operating_hours", SEED_OPERATING_HOURS);
}

export function getSiteText() {
  return getConfig<SiteText>("site_text", SEED_SITE_TEXT);
}

export function getSocialLinks() {
  return getConfig<{ label: string; href: string }[]>("social_links", []);
}

export function getCalUsernames() {
  return getConfig<Record<string, string>>("cal_usernames", {});
}

export function getIntroVideoPath() {
  return getConfig<string | null>("intro_video_path", null);
}
