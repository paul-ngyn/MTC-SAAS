// src/app/account/schedules/page.tsx – Auto-reorder schedules
"use client";

import { useState } from "react";
import { DEMO_SCHEDULES } from "../data";

export default function SchedulesPage() {
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase text-gray-900">
          Auto-reorder schedules
        </h1>
        <button className="text-sm font-bold text-navy hover:text-navy-dark">
          Add a SKU →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {DEMO_SCHEDULES.map((schedule) => {
          const isSkipped = skipped.has(schedule.id);
          return (
            <div key={schedule.id} className="border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide uppercase text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1">
                  {schedule.brandCode}
                </span>
                <span className="text-xs font-bold tracking-wide uppercase text-navy bg-tint border border-tint-border px-2 py-1">
                  {schedule.cadence}
                </span>
              </div>
              <h2 className="mt-4 text-base font-bold text-gray-900 leading-snug">
                {schedule.productName}
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                {schedule.detail} · next:{" "}
                {isSkipped ? "skipped" : schedule.nextDate}
              </p>
              <div className="mt-5 flex items-center gap-5">
                <button
                  onClick={() =>
                    setSkipped((prev) => {
                      const next = new Set(prev);
                      if (next.has(schedule.id)) next.delete(schedule.id);
                      else next.add(schedule.id);
                      return next;
                    })
                  }
                  className="text-sm font-bold text-navy hover:text-navy-dark"
                >
                  {isSkipped ? "Undo skip" : "Skip next"}
                </button>
                <button className="text-sm font-bold text-gray-500 hover:text-navy">
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
