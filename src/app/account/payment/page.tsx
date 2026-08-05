// src/app/account/payment/page.tsx – Payment & Net-30 Terms
import { DEMO_NET30, DEMO_PAYMENT_METHOD } from "../data";
import { formatPrice } from "@/lib/catalog";
import StatusChip from "../StatusChip";

export default function PaymentPage() {
  return (
    <section>
      <h1 className="font-display text-4xl uppercase text-gray-900 mb-8">
        Payment &amp; Net-30 Terms
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border border-gray-200 p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">Net-30 terms</h2>
            <StatusChip status={DEMO_NET30.status} />
          </div>
          <div className="space-y-4">
            <div>
              <div className="font-display text-2xl text-navy">
                {formatPrice(DEMO_NET30.creditLimit)}
              </div>
              <div className="mt-1 eyebrow text-gray-400">Credit limit</div>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
              <span className="text-gray-600">Terms</span>
              <span className="font-semibold text-gray-900">
                {DEMO_NET30.terms}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Next statement</span>
              <span className="font-semibold text-gray-900">
                {DEMO_NET30.nextStatementDate}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 p-7">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Payment method on file
          </h2>
          <p className="text-lg font-semibold text-gray-900">
            {DEMO_PAYMENT_METHOD.brand} ending{" "}
            <span className="tabular-nums">{DEMO_PAYMENT_METHOD.last4}</span>
          </p>
          <p className="mt-1.5 text-sm text-gray-400 tabular-nums">
            Expires {DEMO_PAYMENT_METHOD.expiry}
          </p>
          <button className="mt-6 text-sm font-bold text-navy hover:text-navy-dark">
            Update
          </button>
        </div>
      </div>
    </section>
  );
}
