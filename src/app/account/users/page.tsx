// src/app/account/users/page.tsx – Users & approvals
import { DEMO_USERS } from "../data";
import StatusChip from "../StatusChip";

export default function UsersPage() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase text-gray-900">
          Users &amp; approvals
        </h1>
        <button className="text-sm font-bold text-navy hover:text-navy-dark">
          Invite user →
        </button>
      </div>
      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Name
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Role
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Approval limit
              </th>
              <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_USERS.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.role}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">
                  {user.approvalLimit}
                </td>
                <td className="px-6 py-4">
                  <StatusChip status={user.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
