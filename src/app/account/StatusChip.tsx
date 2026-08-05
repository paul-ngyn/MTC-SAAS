// src/app/account/StatusChip.tsx
import { STATUS_STYLE } from "./data";

export default function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-[11px] font-bold px-2 py-0.5 border ${
        STATUS_STYLE[status] ?? "text-gray-600 bg-gray-100 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}
