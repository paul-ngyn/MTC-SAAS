// src/app/checkout/success/page.tsx
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/categories"
            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
