// lib/account-data.ts – Demo data for the Addresses/Payment/Tax-exempt/Users
// account sub-sections. Display-only for now — mirrors web src/app/account/data.ts.

export const STATUS_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  Verified: { fg: '#1c51a3', bg: '#eaf1fb', border: '#bcd3f0' },
  Active: { fg: '#1c51a3', bg: '#eaf1fb', border: '#bcd3f0' },
  Pending: { fg: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  Invited: { fg: '#b45309', bg: '#fffbeb', border: '#fde68a' },
};

export const DEMO_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Shipping (default)',
    company: 'Maple Bistro Inc.',
    lines: ['482 Elm Street, Dock B', 'Burlington, VT 05401'],
  },
  {
    id: 'addr-2',
    label: 'Billing',
    company: 'Maple Bistro Inc. — Accounts Payable',
    lines: ['100 Corporate Way, Suite 210', 'Burlington, VT 05401'],
  },
];

export const DEMO_NET30 = {
  status: 'Active',
  creditLimit: 1500000,
  terms: 'Net 30',
  nextStatementDate: 'Aug 01, 2026',
};

export const DEMO_PAYMENT_METHOD = {
  brand: 'Visa',
  last4: '4242',
  expiry: '09/28',
};

export const DEMO_TAX_CERTS = [
  { id: 'cert-1', state: 'Vermont', certNumber: 'VT-EX-88213', status: 'Verified', expires: 'Dec 31, 2026' },
  { id: 'cert-2', state: 'New Hampshire', certNumber: 'NH-EX-40217', status: 'Verified', expires: 'Jun 30, 2027' },
  { id: 'cert-3', state: 'Massachusetts', certNumber: 'MA-EX-91004', status: 'Pending', expires: '—' },
];

export const DEMO_USERS = [
  { id: 'user-1', name: 'Pat Owner', role: 'Owner', approvalLimit: 'Unlimited', status: 'Active' },
  { id: 'user-2', name: 'Jamie Lin', role: 'Purchasing manager', approvalLimit: '$5,000.00', status: 'Active' },
  { id: 'user-3', name: 'Chris Boucher', role: 'Line cook', approvalLimit: '$150.00', status: 'Active' },
  { id: 'user-4', name: 'Sam Okafor', role: 'Purchasing manager', approvalLimit: '$5,000.00', status: 'Invited' },
];
