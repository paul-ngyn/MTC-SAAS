// src/app/account/layout.tsx – Shared sidebar shell for all /account/* pages
import AccountNav from "./AccountNav";
import { DEMO_ACCOUNT } from "./data";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-6">
            <h1 className="font-display text-xl text-gray-900">
              {DEMO_ACCOUNT.companyName}
            </h1>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
              <span>Account #{DEMO_ACCOUNT.accountNumber}</span>
              <span>·</span>
              <span className="font-bold text-navy bg-tint border border-tint-border px-1.5 py-0.5 text-[11px]">
                {DEMO_ACCOUNT.tierLabel}
              </span>
            </div>
          </div>
          <AccountNav />
        </aside>

        {/* Page content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
