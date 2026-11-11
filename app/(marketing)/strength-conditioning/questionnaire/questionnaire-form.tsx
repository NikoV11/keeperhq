"use client";

import { useState } from "react";
import Link from "next/link";
import { recommendProgram, SC_RECOMMENDATION_LABELS, type QuestionnaireInput } from "@/lib/sc-recommendation";
import { saveQuestionnaireAction } from "./actions";

const LEVELS: { value: QuestionnaireInput["gkLevel"]; label: string }[] = [
  { value: "youth", label: "Youth" },
  { value: "high_school", label: "High school" },
  { value: "college", label: "College" },
  { value: "semi_pro", label: "Semi-pro" },
  { value: "pro", label: "Professional" },
];

const EQUIPMENT = [
  { value: "none", label: "Bodyweight only" },
  { value: "bands", label: "Resistance bands" },
  { value: "dumbbells", label: "Dumbbells / kettlebells" },
  { value: "barbell", label: "Barbell" },
  { value: "gym", label: "Full gym access" },
];

const INJURY_FLAGS = [
  { value: "current_injury", label: "Currently injured" },
  { value: "past_injury", label: "Past injury (recovered)" },
  { value: "none", label: "No injury history" },
];

export function QuestionnaireForm() {
  const [gkLevel, setGkLevel] = useState<QuestionnaireInput["gkLevel"]>("high_school");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [injuryFlags, setInjuryFlags] = useState<string[]>([]);
  const [weeklyTrainingDays, setWeeklyTrainingDays] = useState(3);
  const [result, setResult] = useState<string | null>(null);
  const [saveNote, setSaveNote] = useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const recommended = recommendProgram({ gkLevel, equipment, injuryFlags, weeklyTrainingDays });
    setResult(recommended);

    const saved = await saveQuestionnaireAction({
      gkLevel,
      equipment,
      injuryFlags,
      weeklyTrainingDays,
      recommended,
    });
    setSaveNote(
      saved.saved
        ? "Saved to your dashboard."
        : "Log in to save this recommendation to your dashboard."
    );
  }

  if (result) {
    return (
      <div className="max-w-xl rounded-2xl border border-brand-green p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
          Your recommended program
        </p>
        <h2 className="mt-2 text-2xl font-bold text-brand-black">
          {SC_RECOMMENDATION_LABELS[result]}
        </h2>
        <p className="mt-3 text-sm text-brand-gray">
          Based on your level, available equipment, and weekly training days. You can start with
          this program, or upgrade to a fully personalized plan built around your athlete intake.
        </p>
        {saveNote && <p className="mt-3 text-sm text-brand-green">{saveNote}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/strength-conditioning" className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark">
            Purchase This Program
          </Link>
          <Link href="/contact?interest=sc" className="rounded-lg border border-brand-green px-5 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white">
            Upgrade to a Personalized Plan
          </Link>
        </div>
        <button onClick={() => setResult(null)} className="mt-4 block text-sm text-brand-gray underline">
          Retake the questionnaire
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <fieldset>
        <legend className="font-semibold text-brand-black">What level do you play at?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setGkLevel(level.value)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                gkLevel === level.value
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-gray-300 text-brand-black hover:border-brand-green"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-brand-black">What equipment do you have?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {EQUIPMENT.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => toggle(equipment, setEquipment, item.value)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                equipment.includes(item.value)
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-gray-300 text-brand-black hover:border-brand-green"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-brand-black">Any injury history?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {INJURY_FLAGS.map((flag) => (
            <button
              key={flag.value}
              type="button"
              onClick={() => toggle(injuryFlags, setInjuryFlags, flag.value)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                injuryFlags.includes(flag.value)
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-gray-300 text-brand-black hover:border-brand-green"
              }`}
            >
              {flag.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-brand-gray">
          This is not medical advice — always clear training with a medical professional if
          you&apos;re currently injured.
        </p>
      </fieldset>

      <div>
        <label className="font-semibold text-brand-black">
          How many days per week can you train? ({weeklyTrainingDays})
        </label>
        <input
          type="range"
          min={1}
          max={7}
          value={weeklyTrainingDays}
          onChange={(e) => setWeeklyTrainingDays(Number(e.target.value))}
          className="mt-2 w-full accent-brand-green"
        />
      </div>

      <button type="submit" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
        Get My Recommendation
      </button>
    </form>
  );
}
