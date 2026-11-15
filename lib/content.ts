import { createClient } from "@/lib/supabase/server";

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

export type Testimonial = {
  id: string;
  kind: "video" | "written";
  name: string;
  affiliation: string | null;
  age: number | null;
  quote: string | null;
  video_path: string | null;
  thumbnail_path: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type GoalkeeperCard = {
  id: string;
  name: string;
  affiliation: string | null;
  level: string | null;
  coach: string | null;
  quote: string | null;
  photo_path: string | null;
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

const FALLBACK_SITE_TEXT: SiteText = {
  tagline: "Develop Your Game. Anywhere. Anytime.",
  hero_description:
    "Online goalkeeper development combining structured technical training, individual feedback, game analysis, and physical performance development.",
  cta: "Start today and take your goalkeeping game to the next level.",
  contact_email: "info@keeperhq.com",
};

const FALLBACK_HOURS: OperatingHours = {
  summary: "Support hours to be confirmed.",
  timezone: "ET",
  note: "Training library available 24/7. Live support, evaluations, and Zoom sessions run during scheduled availability.",
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data as TeamMember[]) ?? [];
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as TeamMember) ?? null;
}

export async function getTestimonials(kind?: "video" | "written"): Promise<Testimonial[]> {
  const supabase = await createClient();
  let query = supabase.from("testimonials").select("*").eq("published", true);
  if (kind) query = query.eq("kind", kind);
  const { data } = await query.order("sort_order");
  return (data as Testimonial[]) ?? [];
}

export async function getGoalkeepers(): Promise<GoalkeeperCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("goalkeepers")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data as GoalkeeperCard[]) ?? [];
}

export async function getLegalDocuments(): Promise<LegalDocument[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("legal_documents").select("*").order("sort_order");
  return (data as LegalDocument[]) ?? [];
}

export async function getLegalDocument(slug: string): Promise<LegalDocument | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as LegalDocument) ?? null;
}

export async function getPackages(): Promise<MembershipPackage[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("membership_packages").select("*").order("sort_order");
  return (data as MembershipPackage[]) ?? [];
}

export async function getSCPrograms(): Promise<SCProgramRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sc_programs")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data as SCProgramRow[]) ?? [];
}

async function getConfig<T>(key: string, fallback: T): Promise<T> {
  const supabase = await createClient();
  const { data } = await supabase.from("app_config").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

export function getOperatingHours() {
  return getConfig<OperatingHours>("operating_hours", FALLBACK_HOURS);
}

export function getSiteText() {
  return getConfig<SiteText>("site_text", FALLBACK_SITE_TEXT);
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
