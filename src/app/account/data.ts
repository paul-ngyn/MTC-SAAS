// src/app/account/data.ts – Demo data shared across the /account/* pages.
// Display-only for now — no backend wiring yet.
import { formatPrice } from "@/lib/catalog";

export const SIDEBAR_LINKS = [
  { label: "Overview", href: "/account" },
  { label: "Order history", href: "/account/orders" },
  { label: "Auto-reorder schedules", href: "/account/schedules" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Payment & Net-30 terms", href: "/account/payment" },
  { label: "Tax-exempt certificates", href: "/account/tax-exempt" },
  { label: "Users & approvals", href: "/account/users" },
];

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(iso: string) {
  // Build the display string directly from the calendar-date components —
  // no Date object, no toLocaleDateString. Both are timezone-sensitive: the
  // server (Node's timezone) and the client (the browser's timezone) can
  // disagree, which causes a hydration mismatch even though it renders the
  // same ISO string on both sides.
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTH_ABBR[month - 1]} ${String(day).padStart(2, "0")}, ${year}`;
}

export const STATUS_STYLE: Record<string, string> = {
  Delivered: "text-navy bg-tint border-tint-border",
  "Returned (1 item)": "text-gray-600 bg-gray-100 border-gray-200",
  Processing: "text-amber-700 bg-amber-50 border-amber-200",
  Verified: "text-navy bg-tint border-tint-border",
  Pending: "text-amber-700 bg-amber-50 border-amber-200",
  Active: "text-navy bg-tint border-tint-border",
  Invited: "text-amber-700 bg-amber-50 border-amber-200",
};

export const DEMO_ACCOUNT = {
  companyName: "Maple Bistro Inc.",
  accountNumber: "48-2210",
  tierLabel: "MTC+ Business",
  spendLast90Days: 1284000, // cents
  savedViaBulkTiers: 140600, // cents
};

export type DemoOrder = {
  id: string;
  date: string;
  lines: number;
  units: number;
  total: number;
  status: string;
};

export const DEMO_ORDERS: DemoOrder[] = [
  { id: "10482", date: "2026-07-08", lines: 6, units: 84, total: 231840, status: "Delivered" },
  { id: "10471", date: "2026-06-30", lines: 3, units: 12, total: 482200, status: "Delivered" },
  { id: "10469", date: "2026-06-24", lines: 9, units: 132, total: 110975, status: "Delivered" },
  { id: "10455", date: "2026-06-12", lines: 2, units: 2, total: 438400, status: "Returned (1 item)" },
  { id: "10448", date: "2026-06-03", lines: 7, units: 96, total: 98630, status: "Delivered" },
  { id: "10440", date: "2026-05-27", lines: 4, units: 40, total: 122010, status: "Delivered" },
];

export type DemoSchedule = {
  id: string;
  brandCode: string;
  cadence: string;
  productName: string;
  detail: string;
  nextDate: string;
};

export const DEMO_SCHEDULES: DemoSchedule[] = [
  { id: "sched-1", brandCode: "TD", cadence: "Weekly", productName: "32 oz Round Container with Lid, Case of 150", detail: "10 cases / delivery", nextDate: "Jul 15" },
  { id: "sched-2", brandCode: "MTC", cadence: "Bi-weekly", productName: '18" Food Film Wrap, 2000 ft Roll', detail: "12 rolls / delivery", nextDate: "Jul 21" },
  { id: "sched-3", brandCode: "MTC", cadence: "Monthly", productName: "Degreaser Concentrate, 5 gal Pail", detail: "4 pails / delivery", nextDate: "Aug 01" },
];

export const DEMO_ADDRESSES = [
  {
    id: "addr-1",
    label: "Shipping (default)",
    company: "Maple Bistro Inc.",
    lines: ["482 Elm Street, Dock B", "Burlington, VT 05401"],
  },
  {
    id: "addr-2",
    label: "Billing",
    company: "Maple Bistro Inc. — Accounts Payable",
    lines: ["100 Corporate Way, Suite 210", "Burlington, VT 05401"],
  },
];

export const DEMO_NET30 = {
  status: "Active",
  creditLimit: 1500000,
  terms: "Net 30",
  nextStatementDate: "Aug 01, 2026",
};

export const DEMO_PAYMENT_METHOD = {
  brand: "Visa",
  last4: "4242",
  expiry: "09/28",
};

export const DEMO_TAX_CERTS = [
  { id: "cert-1", state: "Vermont", certNumber: "VT-EX-88213", status: "Verified", expires: "Dec 31, 2026" },
  { id: "cert-2", state: "New Hampshire", certNumber: "NH-EX-40217", status: "Verified", expires: "Jun 30, 2027" },
  { id: "cert-3", state: "Massachusetts", certNumber: "MA-EX-91004", status: "Pending", expires: "—" },
];

export const DEMO_USERS = [
  { id: "user-1", name: "Pat Owner", role: "Owner", approvalLimit: "Unlimited", status: "Active" },
  { id: "user-2", name: "Jamie Lin", role: "Purchasing manager", approvalLimit: formatPrice(500000), status: "Active" },
  { id: "user-3", name: "Chris Boucher", role: "Line cook", approvalLimit: formatPrice(15000), status: "Active" },
  { id: "user-4", name: "Sam Okafor", role: "Purchasing manager", approvalLimit: formatPrice(500000), status: "Invited" },
];
