import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  LogOut,
  Camera,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { settingsService } from '../../services/settingsService';

export const AdminMyAccount: React.FC = () => {
  const { user, signOut } = useAuth();

  // Profile State
  const [profile, setProfile] = useState<{
    fullName: string;
    avatarUrl: string | null;
    role: string;
  }>({
    fullName: '',
    avatarUrl: null,
    role: 'super_admin',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Change Email State
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminProfile() {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('admin_profiles')
          .select('full_name, avatar_url, role')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile({
            fullName: data.full_name || '',
            avatarUrl: data.avatar_url || null,
            role: data.role || 'super_admin',
          });
        }
      } catch (e) {
        console.warn('Error fetching profile:', e);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchAdminProfile();
  }, [user]);

  // Avatar Upload Handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    setProfileError(null);
    try {
      const url = await settingsService.uploadSiteAsset(file, 'avatars');
      await supabase
        .from('admin_profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      setProfile((prev) => ({ ...prev, avatarUrl: url }));
      setProfileSuccess('Profile photo updated successfully!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to upload photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Update Profile Name Handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({ full_name: profile.fullName.trim(), updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw new Error(error.message);

      setProfileSuccess('Profile display name updated successfully!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Change Email Handler
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setEmailError(null);
    setEmailSuccess(null);

    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setEmailError('Please enter a valid new email address.');
      return;
    }

    if (newEmail.trim().toLowerCase() === user.email?.toLowerCase()) {
      setEmailError('New email must be different from current email.');
      return;
    }

    if (!emailPassword) {
      setEmailError('Please enter your current password to authorize this email change.');
      return;
    }

    setUpdatingEmail(true);
    try {
      // 1. Re-authenticate current user
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: emailPassword,
      });

      if (authError) {
        throw new Error('Current password verification failed. Please enter your correct password.');
      }

      // 2. Request email update
      const { error: updateError } = await supabase.auth.updateUser(
        { email: newEmail.trim() },
        { emailRedirectTo: window.location.origin + '/admin/account' }
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      setEmailSuccess(
        `Confirmation link sent! Please check both ${user.email} and ${newEmail.trim()} to verify and complete the email change.`
      );
      setNewEmail('');
      setEmailPassword('');
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email.');
    } finally {
      setUpdatingEmail(false);
    }
  };

  // Change Password Handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password cannot be the same as your current password.');
      return;
    }

    setUpdatingPassword(true);
    try {
      // 1. Re-authenticate current password to prevent unauthorized tampering
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (authError) {
        throw new Error('Current password is incorrect. Please verify and try again.');
      }

      // 2. Apply new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setPasswordSuccess('Password successfully changed! Your new credentials are now active.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-brand-orange" />
            <span>My Account &amp; Credentials</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Manage your personal administrator profile, login email address, password, and active authentication session.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card & Role (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-gray-100">
              {/* Avatar with Camera upload button */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-brand-charcoal border-2 border-brand-orange p-0.5 shadow-md flex items-center justify-center">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl font-extrabold text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-orange text-white hover:bg-brand-orange-hover cursor-pointer shadow-md transition-transform group-hover:scale-105">
                  {uploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>

              <div>
                <h3 className="font-bold text-brand-charcoal text-base">
                  {profile.fullName || 'Administrator'}
                </h3>
                <span className="text-xs text-gray-500 font-mono">{user?.email}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Role: {profile.role}</span>
              </div>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {/* Edit Display Name */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Display Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Keshavan Realty Administrator"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updatingProfile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Name...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Display Name</span>
                  </>
                )}
              </button>
            </form>

            {/* Session Metadata */}
            <div className="pt-2 text-[11px] text-gray-400 space-y-1.5 border-t border-gray-100">
              <p>
                <strong>User ID:</strong> <span className="font-mono text-[10px]">{user?.id}</span>
              </p>
              <p>
                <strong>Last Sign In:</strong>{' '}
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString('en-IN')
                  : 'Active Session'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password & Change Email (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
              <KeyRound className="w-4 h-4 text-brand-orange" />
              <span>Change Login Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover shadow-md transition-all disabled:opacity-50"
              >
                {updatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying &amp; Updating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Login Email Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
              <Mail className="w-4 h-4 text-brand-orange" />
              <span>Change Login Email Address</span>
            </h3>

            {emailSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{emailSuccess}</span>
              </div>
            )}

            {emailError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{emailError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    New Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new-admin@keshavanrealty.com"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Current Password (Authorization)
                  </label>
                  <input
                    type="password"
                    required
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="Confirm current password"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingEmail}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-brand-charcoal bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {updatingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Verification...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-brand-orange" />
                    <span>Request Email Change</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
