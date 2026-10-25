import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if recovery session is active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasValidSession(true);
      } else {
        // Also listen to hash changes for recovery token
        const hash = window.location.hash;
        if (hash.includes('access_token')) {
          setHasValidSession(true);
        } else {
          setErrorMsg('No valid password recovery token found or link has expired.');
        }
      }
      setVerifyingSession(false);
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMsg('Your password has been successfully updated! Redirecting to admin dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. The recovery link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (verifyingSession) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <div className="text-center space-y-3 text-white">
          <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
          <p className="text-xs text-gray-300">Verifying secure recovery token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-charcoal-surface border border-brand-orange/40 p-2 flex items-center justify-center shadow-lg">
              <img src="/keshavan-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <span className="text-lg font-display font-extrabold text-white tracking-tight block">
                KESHAVAN <span className="text-brand-orange">REALTY</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                Password Recovery
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-brand-charcoal flex items-center justify-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-orange" />
              <span>Set New Password</span>
            </h2>
            <p className="text-xs text-gray-500">
              Enter your new secure password below to regain access to your administrator account.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {hasValidSession ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-orange" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-orange" />
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save Password &amp; Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl"
              >
                Return to Admin Login
              </Link>
            </div>
          )}

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-100">
            <Link to="/admin/login" className="text-brand-orange hover:underline">
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
