import React, { useState, useEffect } from 'react';
import {
  Shield,
  UserPlus,
  Users,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface AdminMember {
  id: string;
  email: string;
  fullName: string;
  role: 'owner' | 'manager' | 'staff' | 'super_admin';
  avatarUrl: string | null;
  createdAt: string;
}

export const AdminTeamSecurity: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>('owner');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Invite/Add Admin Modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'manager' | 'staff'>('manager');
  const [inviting, setInviting] = useState(false);
  const [showInvitePassword, setShowInvitePassword] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);

      const mapped: AdminMember[] = (data || []).map((row: any) => ({
        id: row.id,
        email: row.email,
        fullName: row.full_name || 'Administrator',
        role: row.role || 'manager',
        avatarUrl: row.avatar_url,
        createdAt: row.created_at,
      }));
      setMembers(mapped);

      // Current user's role
      const me = mapped.find((m) => m.id === user?.id);
      if (me) {
        setCurrentUserRole(me.role);
      }
    } catch (e: any) {
      console.warn('Error fetching team members:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const isOwner = currentUserRole === 'owner' || currentUserRole === 'super_admin';

  // Role update handler (Owners only)
  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!isOwner) {
      alert('Only Owners can change administrator roles.');
      return;
    }

    if (memberId === user?.id) {
      alert('You cannot change your own Owner role.');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', memberId);

      if (error) throw new Error(error.message);

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole as any } : m))
      );
      setActionSuccess(`Role updated to ${newRole.toUpperCase()}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update role.');
    }
  };

  // Remove Admin handler (Owners only)
  const handleDeleteMember = async (member: AdminMember) => {
    if (!isOwner) {
      alert('Only Owners have permission to remove administrator accounts.');
      return;
    }

    if (member.id === user?.id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${member.email} from administrator privileges?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', member.id);

      if (error) throw new Error(error.message);

      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      setActionSuccess(`Administrator privileges revoked for ${member.email}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to remove administrator.');
    }
  };

  // Create New Administrator
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      alert('Only Owners can create or invite new administrators.');
      return;
    }

    setInviting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      // 1. Create account via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteEmail.trim(),
        password: invitePassword,
        options: {
          data: {
            full_name: inviteName.trim(),
          },
        },
      });

      if (authError) throw new Error(authError.message);

      const newUserId = authData.user?.id;
      if (newUserId) {
        // 2. Insert into admin_profiles
        await supabase.from('admin_profiles').upsert({
          id: newUserId,
          email: inviteEmail.trim(),
          full_name: inviteName.trim(),
          role: inviteRole,
        });

        setActionSuccess(`Administrator account created for ${inviteEmail.trim()} with role ${inviteRole.toUpperCase()}!`);
        setIsInviteOpen(false);
        setInviteEmail('');
        setInviteName('');
        setInvitePassword('');
        fetchMembers();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to create administrator account.');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-brand-orange" />
            <span>Team &amp; Security Roles</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Manage authorized administrators, assign role-based access permissions, and protect sensitive platform operations.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover shadow-md hover:shadow-glow transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Administrator</span>
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-rose-800 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Role Definitions Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Owner Role</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Full control over website configuration, branding, team credentials, property listings, and private customer leads.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Manager Role</span>
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Manage properties, customer inquiries, appearance, and homepage content. Cannot modify team accounts or security roles.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-gray-800">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span>Staff Role</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Restricted access to view customer inquiries and property listings. Cannot edit core website settings or branding.
          </p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-brand-charcoal text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-orange" />
            <span>Authorized Administrators ({members.length})</span>
          </h3>
          <span className="text-xs text-gray-400">Database-enforced RLS</span>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-semibold">Loading administrators...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-grey/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Administrator</th>
                  <th className="py-3.5 px-6">Current Role</th>
                  <th className="py-3.5 px-6">Permissions</th>
                  <th className="py-3.5 px-6">Added On</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => {
                  const isMe = member.id === user?.id;
                  const roleNormalized = member.role === 'super_admin' ? 'owner' : member.role;

                  return (
                    <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-charcoal border border-brand-orange/40 text-white font-bold flex items-center justify-center shrink-0">
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              member.email.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-charcoal">{member.fullName}</span>
                              {isMe && (
                                <span className="bg-brand-orange-light text-brand-orange text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-500 font-mono">{member.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {isOwner && !isMe ? (
                          <select
                            value={roleNormalized}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg py-1 px-2.5 text-xs font-bold text-brand-charcoal cursor-pointer"
                          >
                            <option value="owner">Owner (Full Control)</option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              roleNormalized === 'owner'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : roleNormalized === 'manager'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>{roleNormalized}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                        {roleNormalized === 'owner'
                          ? 'All Platform Controls'
                          : roleNormalized === 'manager'
                          ? 'Properties, Leads & Content'
                          : 'Read-only Leads & Listings'}
                      </td>

                      <td className="py-4 px-6 text-gray-400 whitespace-nowrap">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Initial Admin'}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {isOwner && !isMe ? (
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Administrator Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-brand-charcoal text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-orange" />
                <span>Add Administrator Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-orange" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-orange" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin-partner@keshavanrealty.com"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-orange" />
                  Initial Password
                </label>
                <div className="relative">
                  <input
                    type={showInvitePassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInvitePassword(!showInvitePassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showInvitePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                  Assigned Platform Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal cursor-pointer"
                >
                  <option value="manager">Manager (Properties, Leads &amp; Content)</option>
                  <option value="owner">Owner (Full System &amp; Team Access)</option>
                  <option value="staff">Staff (Enquiries &amp; Property Viewing)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Administrator</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
