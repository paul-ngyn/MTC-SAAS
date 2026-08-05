// src/app/account/page.tsx – Account overview: a hub linking to every section
import Link from "next/link";
import {
  DEMO_ORDERS,
  DEMO_SCHEDULES,
  DEMO_ADDRESSES,
  DEMO_NET30,
  DEMO_TAX_CERTS,
  DEMO_USERS,
} from "./data";

const verifiedCerts = DEMO_TAX_CERTS.filter((c) => c.status === "Verified").length;

const SECTIONS = [
  {
    label: "Order history",
    href: "/account/orders",
    teaser: `${DEMO_ORDERS.length} orders in the last 90 days`,
  },
  {
    label: "Auto-reorder schedules",
    href: "/account/schedules",
    teaser: `${DEMO_SCHEDULES.length} active schedule${DEMO_SCHEDULES.length === 1 ? "" : "s"}`,
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    teaser: `${DEMO_ADDRESSES.length} saved addresses`,
  },
  {
    label: "Payment & Net-30 terms",
    href: "/account/payment",
    teaser: `Net 30 · ${DEMO_NET30.status}`,
  },
  {
    label: "Tax-exempt certificates",
    href: "/account/tax-exempt",
    teaser: `${verifiedCerts} verified, ${DEMO_TAX_CERTS.length - verifiedCerts} pending`,
  },
  {
    label: "Users & approvals",
    href: "/account/users",
    teaser: `${DEMO_USERS.length} users`,
  },
];

export default function AccountOverviewPage() {
  return (
    <section>
      <h1 className="font-display text-4xl uppercase text-gray-900 mb-2">
        Account
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        Manage orders, schedules, addresses, billing, and your team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group border border-gray-200 p-7 hover:border-navy hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-navy transition-colors">
              {section.label}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{section.teaser}</p>
            <span className="mt-4 inline-block text-sm font-bold text-navy">
              View →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
