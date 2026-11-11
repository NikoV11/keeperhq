import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { LEGAL_DOCS, getLegalDoc } from "@/content/legal";

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  return { title: doc ? `${doc.title} | KeeperHQ` : "Legal | KeeperHQ" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <Section>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-black">{doc.title}</h1>
        <div className="mt-6 space-y-4">
          {doc.body.map((paragraph, i) => (
            <p
              key={i}
              className={i === 0 ? "rounded-lg bg-brand-gray-light p-4 text-sm text-brand-gray" : "text-brand-gray"}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
