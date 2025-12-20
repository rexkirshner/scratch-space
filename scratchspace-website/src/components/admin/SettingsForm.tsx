/**
 * Settings Form Component
 * Form for updating email and password
 *
 * @module components/admin/SettingsForm
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Email form state
  const [email, setEmail] = useState(user.email);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Email updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update email' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Failed to update email' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 12) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 12 characters',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Password updated successfully!',
        });
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-900/20 border border-green-900 text-green-400'
              : 'bg-red-900/20 border border-red-900 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Email Update Form */}
      <form onSubmit={handleEmailUpdate}>
        <h2 className="text-xl font-semibold text-white mb-4">
          Update Email
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || email === user.email}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Email'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Password Update Form */}
      <form onSubmit={handlePasswordUpdate}>
        <h2 className="text-xl font-semibold text-white mb-4">
          Change Password
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={12}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 12 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={12}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
