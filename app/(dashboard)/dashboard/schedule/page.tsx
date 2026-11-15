import { CalEmbed } from "@/components/cal-embed";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Schedule My Zoom</h1>
        <p className="text-brand-gray">Book your evaluation or coaching call directly below.</p>
      </div>
      <div className="rounded-xl bg-white p-2 shadow-sm">
        <CalEmbed coach="stefan" />
      </div>
    </div>
  );
}
