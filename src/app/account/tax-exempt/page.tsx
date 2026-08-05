// src/app/account/tax-exempt/page.tsx – Tax-exempt certificates
import { DEMO_TAX_CERTS } from "../data";
import StatusChip from "../StatusChip";

export default function TaxExemptPage() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase text-gray-900">
          Tax-exempt certificates
        </h1>
        <button className="text-sm font-bold text-navy hover:text-navy-dark">
          Upload certificate →
        </button>
      </div>
      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                State
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Certificate #
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Status
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Expires
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_TAX_CERTS.map((cert) => (
              <tr key={cert.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {cert.state}
                </td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">
                  {cert.certNumber}
                </td>
                <td className="px-6 py-4">
                  <StatusChip status={cert.status} />
                </td>
                <td className="px-6 py-4 text-gray-600">{cert.expires}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
