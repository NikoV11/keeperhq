import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-2xl font-bold tracking-wide text-brand-white">
        KEEPER<span className="text-brand-green-light">HQ</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-brand-white p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
