/**
 * Admin Layout
 * Wraps all admin pages with header and navigation
 *
 * @module app/(authenticated)/admin/layout
 * @see PRD Phase 4: Admin Dashboard UI
 */

import { Header } from '@/components/shared/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <Header showLogout />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
