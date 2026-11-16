import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 py-12">
      <Logo size="lg" className="mb-8 text-paper" />
      <div className="w-full max-w-md rounded-2xl bg-paper p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
