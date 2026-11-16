import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-4 py-12">
      <Logo size="lg" className="mb-8 text-brand-white" />
      <div className="w-full max-w-md rounded-2xl bg-brand-white p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
