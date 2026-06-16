// src/app/membership/success/page.tsx
import Link from "next/link";

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6 text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 3a2 2 0 00-2 2v3a5 5 0 0010 0V5a2 2 0 00-2-2M5 3H3m16 0h2M9 17v2m6-2v2m-6 2h6" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Welcome to the Club!</h1>
        <p className="text-gray-500 mb-8">
          Your membership is now active. Enjoy exclusive wholesale pricing and
          priority support on every order.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/categories"
            className="px-8 py-3 bg-[#1c51a3] text-white font-bold rounded-lg hover:bg-[#163d7d] transition-colors"
          >
            Start Shopping
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
