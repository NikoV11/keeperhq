import { PageHeader, Card, Field, inputClass, SaveButton, HelpNote } from "@/components/admin/ui";
import { FileUploadField } from "@/components/admin/file-upload-field";
import {
  getSiteText,
  getOperatingHours,
  getSocialLinks,
  getCalUsernames,
  getIntroVideoPath,
} from "@/lib/content";
import { saveSettingsAction } from "./actions";

export default async function AdminSettingsPage() {
  const [siteText, hours, social, cal, introVideo] = await Promise.all([
    getSiteText(),
    getOperatingHours(),
    getSocialLinks(),
    getCalUsernames(),
    getIntroVideoPath(),
  ]);

  return (
    <div>
      <PageHeader
        title="Site Text & Hours"
        description="Your homepage wording, operating hours, booking links, and social media."
      />

      <HelpNote>
        These settings appear across your whole website — the homepage, the footer, and your
        contact page.
      </HelpNote>

      <form action={saveSettingsAction} className="space-y-6">
        <Card className="space-y-4">
          <h2 className="font-semibold text-brand-black">Homepage wording</h2>

          <Field label="Tagline" hint="Appears under your logo and throughout the site.">
            <input name="tagline" defaultValue={siteText.tagline} className={inputClass} />
          </Field>

          <Field label="Hero description" hint="The paragraph at the top of your homepage.">
            <textarea
              name="hero_description"
              rows={3}
              defaultValue={siteText.hero_description}
              className={inputClass}
            />
          </Field>

          <Field label="Call to action">
            <input name="cta" defaultValue={siteText.cta} className={inputClass} />
          </Field>

          <Field label="Contact email" hint="Shown in your footer.">
            <input
              name="contact_email"
              type="email"
              defaultValue={siteText.contact_email}
              className={inputClass}
            />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-brand-black">Introduction video</h2>
          <FileUploadField
            name="intro_video_path"
            label="Homepage intro video"
            accept="video/*"
            prefix="brand"
            currentPath={introVideo}
            hint="The ~2 minute introduction video near the top of the homepage."
          />
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-brand-black">Operating hours</h2>

          <Field label="Hours summary" hint="For example: Monday–Friday, 9am–6pm.">
            <input name="hours_summary" defaultValue={hours.summary} className={inputClass} />
          </Field>

          <Field label="Time zone" hint="For example: ET, CET.">
            <input name="hours_timezone" defaultValue={hours.timezone} className={inputClass} />
          </Field>

          <Field label="Extra note">
            <textarea name="hours_note" rows={2} defaultValue={hours.note} className={inputClass} />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-brand-black">Booking links (Cal.com)</h2>
          <p className="text-sm text-brand-gray">
            Your free Cal.com username for each coach. Booking calendars stay hidden until these
            are filled in.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stefan">
              <input name="cal_stefan" defaultValue={cal.stefan ?? ""} className={inputClass} />
            </Field>
            <Field label="Paul">
              <input name="cal_paul" defaultValue={cal.paul ?? ""} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-brand-black">Social media</h2>
          <Field
            label="Links"
            hint="One per line, as: Instagram | https://instagram.com/yourpage"
          >
            <textarea
              name="social_links"
              rows={4}
              defaultValue={social.map((s) => `${s.label} | ${s.href}`).join("\n")}
              className={inputClass}
            />
          </Field>
        </Card>

        <SaveButton>Save All Settings</SaveButton>
      </form>
    </div>
  );
}
