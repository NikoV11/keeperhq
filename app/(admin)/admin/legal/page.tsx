import { getLegalDocuments } from "@/lib/content";
import { PageHeader, Card, Field, inputClass, SaveButton, HelpNote } from "@/components/admin/ui";
import { saveLegalDocumentAction } from "./actions";

export default async function AdminLegalPage() {
  const documents = await getLegalDocuments();

  return (
    <div>
      <PageHeader
        title="Legal Pages"
        description="Your terms, privacy policy, waiver, and other policies."
      />

      <HelpNote>
        <strong>These are placeholders written as examples only.</strong> Have a lawyer review
        your real policies before you start taking payments — especially the Liability Waiver
        and the Privacy Policy, since you collect data about children.
      </HelpNote>

      <div className="space-y-6">
        {documents.map((doc) => (
          <Card key={doc.slug}>
            <form action={saveLegalDocumentAction} className="space-y-4">
              <input type="hidden" name="slug" value={doc.slug} />

              <div className="flex items-center justify-between">
                <h2 className="font-bold text-brand-black">{doc.title}</h2>
                <span className="text-xs text-brand-gray">/legal/{doc.slug}</span>
              </div>

              <Field label="Page title">
                <input name="title" required defaultValue={doc.title} className={inputClass} />
              </Field>

              <Field label="Page text" hint="Leave a blank line between paragraphs.">
                <textarea
                  name="body"
                  rows={10}
                  defaultValue={doc.body}
                  className={`${inputClass} font-mono text-xs`}
                />
              </Field>

              <SaveButton>Save {doc.title}</SaveButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
