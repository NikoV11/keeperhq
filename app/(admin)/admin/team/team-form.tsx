import { Card, Field, inputClass, SaveButton } from "@/components/admin/ui";
import { FileUploadField } from "@/components/admin/file-upload-field";
import type { TeamMember } from "@/lib/content";
import { saveTeamMemberAction } from "./actions";

export function TeamMemberForm({ member }: { member: TeamMember }) {
  return (
    <Card>
      <form action={saveTeamMemberAction} className="space-y-4">
        <input type="hidden" name="id" value={member.id} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">{member.name}</h2>
          <span className="text-xs text-ink-muted">/about/{member.slug}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" required defaultValue={member.name} className={inputClass} />
          </Field>
          <Field label="Job title">
            <input
              name="role_title"
              required
              defaultValue={member.role_title}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Short bio" hint="One or two sentences, shown on the About page card.">
          <textarea
            name="short_bio"
            rows={3}
            defaultValue={member.short_bio ?? ""}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <FileUploadField
            name="photo_path"
            label="Photo"
            accept="image/*"
            prefix="photos"
            currentPath={member.photo_path}
            hint="A square photo looks best."
          />
          <FileUploadField
            name="cv_path"
            label="CV / Résumé (PDF)"
            accept="application/pdf"
            prefix="cv"
            currentPath={member.cv_path}
            hint="Visitors get a download button when this is set."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cal.com username" hint="For booking calls. Leave empty if not using.">
            <input
              name="cal_username"
              defaultValue={member.cal_username ?? ""}
              placeholder="e.g. stefan-keeperhq"
              className={inputClass}
            />
          </Field>
          <Field label="Languages" hint="Separate with commas.">
            <input
              name="languages"
              defaultValue={member.languages.join(", ")}
              className={inputClass}
            />
          </Field>
        </div>

        <fieldset className="rounded-lg bg-paper-warm p-4">
          <legend className="px-1 text-sm font-semibold text-ink">
            Profile page sections
          </legend>
          <div className="space-y-3">
            {member.sections.map((section, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[200px_1fr]">
                <input
                  name={`section_heading_${i}`}
                  defaultValue={section.heading}
                  className={inputClass}
                />
                <textarea
                  name={`section_body_${i}`}
                  rows={2}
                  defaultValue={section.body}
                  className={inputClass}
                />
              </div>
            ))}
            <input type="hidden" name="section_count" value={member.sections.length} />
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <SaveButton>Save {member.name.split(" ")[0]}</SaveButton>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" name="published" defaultChecked={member.published} />
            Show on website
          </label>
        </div>
      </form>
    </Card>
  );
}
