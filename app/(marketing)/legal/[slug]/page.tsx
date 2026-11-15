import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { getLegalDocument } from "@/lib/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  return { title: doc ? `${doc.title} | KeeperHQ` : "Legal | KeeperHQ" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  if (!doc) notFound();

  const paragraphs = doc.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <Section>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-black">{doc.title}</h1>
        <div className="mt-6 space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-wrap text-brand-gray">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
