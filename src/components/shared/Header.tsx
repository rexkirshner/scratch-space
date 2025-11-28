/**
 * Shared Header Component
 * Used in admin layout with logout functionality
 *
 * @module components/shared/Header
 * @see PRD Phase 4: Admin Dashboard UI
 */

'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  showLogout?: boolean;
}

export function Header({ showLogout = false }: HeaderProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="border-b border-gray-800 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
              scratchspace.dev
            </Link>
            {showLogout && (
              <span className="ml-4 text-sm text-gray-500">Admin Dashboard</span>
            )}
          </div>

          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Admin Navigation */}
        {showLogout && (
          <nav className="mt-4 flex gap-6 border-t border-gray-800 pt-4">
            <Link
              href="/admin"
              className={`text-sm transition-colors ${
                pathname === '/admin'
                  ? 'text-green-400 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Projects
            </Link>
            <Link
              href="/admin/settings"
              className={`text-sm transition-colors ${
                pathname === '/admin/settings'
                  ? 'text-green-400 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
