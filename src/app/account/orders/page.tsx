// src/app/account/orders/page.tsx – Order History
import { DEMO_ACCOUNT, DEMO_ORDERS, DEMO_SCHEDULES, formatDate } from "../data";
import { formatPrice } from "@/lib/catalog";
import StatusChip from "../StatusChip";

export default function OrderHistoryPage() {
  return (
    <section>
      <h1 className="font-display text-4xl uppercase text-gray-900 mb-8">
        Order History
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="border border-gray-200 p-7">
          <div className="font-display text-3xl text-navy">
            {formatPrice(DEMO_ACCOUNT.spendLast90Days)}
          </div>
          <div className="mt-2 eyebrow text-gray-400">Spend, last 90 days</div>
        </div>
        <div className="border border-gray-200 p-7">
          <div className="font-display text-3xl text-navy">
            {formatPrice(DEMO_ACCOUNT.savedViaBulkTiers)}
          </div>
          <div className="mt-2 eyebrow text-gray-400">Saved via bulk tiers</div>
        </div>
        <div className="border border-gray-200 p-7">
          <div className="font-display text-3xl text-navy">
            {DEMO_SCHEDULES.length}
          </div>
          <div className="mt-2 eyebrow text-gray-400">Active auto-reorders</div>
        </div>
      </div>

      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Order
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Date
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Items
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Total
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Status
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {DEMO_ORDERS.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-6 py-4 font-bold text-navy">#{order.id}</td>
                <td className="px-6 py-4 text-gray-600">{formatDate(order.date)}</td>
                <td className="px-6 py-4 text-gray-600">
                  {order.lines} lines · {order.units} units
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 tabular-nums">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4">
                  <StatusChip status={order.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-bold text-navy hover:text-navy-dark">
                    Reorder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
