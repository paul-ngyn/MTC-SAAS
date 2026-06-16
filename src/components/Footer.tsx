// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <span className="text-xl font-extrabold text-white">MTC Supply Hub</span>
          <p className="mt-2 text-sm">
            The central marketplace for restaurant supply distributors.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
            <li><Link href="/categories/kitchen-equipment" className="hover:text-white transition-colors">Kitchen Equipment</Link></li>
            <li><Link href="/categories/disposables" className="hover:text-white transition-colors">Disposables</Link></li>
            <li><Link href="/categories/smallwares" className="hover:text-white transition-colors">Smallwares</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/membership" className="hover:text-white transition-colors">Membership Plans</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} MTC Supply Hub. All rights reserved.
      </div>
    </footer>
  );
}
