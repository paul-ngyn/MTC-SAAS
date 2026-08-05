// src/app/account/addresses/page.tsx – Addresses
import { DEMO_ADDRESSES } from "../data";

export default function AddressesPage() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase text-gray-900">
          Addresses
        </h1>
        <button className="text-sm font-bold text-navy hover:text-navy-dark">
          + Add address
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {DEMO_ADDRESSES.map((addr) => (
          <div key={addr.id} className="border border-gray-200 p-6">
            <span className="text-xs font-bold tracking-wide uppercase text-navy bg-tint border border-tint-border px-2 py-1">
              {addr.label}
            </span>
            <p className="mt-4 text-base font-bold text-gray-900">
              {addr.company}
            </p>
            {addr.lines.map((line) => (
              <p key={line} className="text-sm text-gray-600 leading-relaxed">
                {line}
              </p>
            ))}
            <button className="mt-5 text-sm font-bold text-navy hover:text-navy-dark">
              Edit
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
