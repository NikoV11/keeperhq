import { CalEmbed } from "@/components/cal-embed";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Schedule My Zoom</h1>
        <p className="text-ink-muted">Book your evaluation or coaching call directly below.</p>
      </div>
      <div className="rounded-[0.875rem] bg-paper p-2 shadow-sm">
        <CalEmbed coach="stefan" />
      </div>
    </div>
  );
}
