// lib/reorder-store.ts – Auto-reorder schedules, persisted locally.
//
// There is no backend table or cron for auto-reorder yet, so this store is
// the source of truth: it tracks what's scheduled and when "next delivery"
// falls, and lets the user skip an upcoming run. Nothing actually places an
// order automatically — it's a real, working schedule list, just not wired
// to a server-side job.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Cadence = 'weekly' | 'biweekly' | 'monthly';

export type ReorderSchedule = {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  cadence: Cadence;
  nextDate: string; // ISO date
};

const CADENCE_DAYS: Record<Cadence, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

export const CADENCE_LABEL: Record<Cadence, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
};

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

type ReorderStore = {
  schedules: ReorderSchedule[];
  addSchedule: (s: Omit<ReorderSchedule, 'id' | 'nextDate'>) => void;
  removeSchedule: (id: string) => void;
  skipNext: (id: string) => void;
};

export const useReorderStore = create<ReorderStore>()(
  persist(
    (set) => ({
      schedules: [],

      addSchedule: (s) =>
        set((state) => ({
          schedules: [
            ...state.schedules,
            {
              ...s,
              id: `${s.productId}-${Date.now()}`,
              nextDate: addDays(new Date().toISOString(), CADENCE_DAYS[s.cadence]),
            },
          ],
        })),

      removeSchedule: (id) =>
        set((state) => ({ schedules: state.schedules.filter((s) => s.id !== id) })),

      skipNext: (id) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, nextDate: addDays(s.nextDate, CADENCE_DAYS[s.cadence]) } : s
          ),
        })),
    }),
    {
      name: 'mtc-reorder-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
