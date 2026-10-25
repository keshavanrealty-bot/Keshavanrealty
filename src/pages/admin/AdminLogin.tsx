import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { businessConfig } from '../../config/business';
import { supabase } from '../../lib/supabase';

export const AdminLogin: React.FC = () => {
  const { user, isAdmin, signIn, signUpAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'signin' | 'setup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null);

  // Password Recovery Modal State
  const [forgotOpen, setForgotOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [sendingRecovery, setSendingRecovery] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // If already authenticated and admin, redirect
  React.useEffect(() => {
    if (user && isAdmin) {
      const target = (location.state as any)?.from?.pathname || '/admin';
      navigate(target, { replace: true });
    }
  }, [user, isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSetupSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }
        const target = (location.state as any)?.from?.pathname || '/admin';
        navigate(target, { replace: true });
      } else {
        // Setup Initial Administrator
        const { error } = await signUpAdmin(email.trim(), password, fullName.trim() || 'Administrator');
        if (error) {
          setErrorMessage(error.message || 'Failed to initialize administrator account.');
          setLoading(false);
          return;
        }
        setSetupSuccess('Administrator account created! You can now sign in with your credentials.');
        setMode('signin');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreFillAdmin = () => {
    setEmail('admin@keshavanrealty.com');
    setPassword('Keshavan@2026');
    setErrorMessage(null);
  };

  const handleSendRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    if (!recoveryEmail.trim()) {
      setRecoveryError('Please enter your administrator email address.');
      return;
    }

    setSendingRecovery(true);
    try {
      const redirectUrl = `${window.location.origin}/admin/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        // Do not reveal user existence
        console.warn('Password recovery error:', error.message);
      }

      setRecoverySuccess(
        `If an administrator account exists for ${recoveryEmail.trim()}, a password recovery link has been dispatched. Please check your inbox and spam folder.`
      );
    } catch (err: any) {
      setRecoveryError('An error occurred while dispatching recovery email. Please try again.');
    } finally {
      setSendingRecovery(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-brand-charcoal-surface border border-brand-orange/40 p-2 flex items-center justify-center shadow-lg group-hover:border-brand-orange transition-colors">
              <img src="/keshavan-logo.png" alt="Keshavan Realty" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <span className="text-xl font-display font-extrabold text-white tracking-tight leading-tight block">
                KESHAVAN <span className="text-brand-orange">REALTY</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-400">
                Administration Portal
              </span>
            </div>
          </Link>
          <p className="text-xs text-gray-300">
            Secure administrative platform for property records, media, and customer leads.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-gray-100 space-y-6">
          {/* Tabs: Sign In / Initial Admin Setup */}
          <div className="flex border-b border-gray-100 pb-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`pb-2 text-xs font-bold transition-all relative ${
                mode === 'signin'
                  ? 'text-brand-charcoal border-b-2 border-brand-orange'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In to Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('setup');
                setErrorMessage(null);
                if (!email) setEmail(businessConfig.email);
              }}
              className={`pb-2 text-xs font-bold transition-all relative ${
                mode === 'setup'
                  ? 'text-brand-charcoal border-b-2 border-brand-orange'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Initial Setup
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {setupSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{setupSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'setup' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-orange" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Keshavan Realty Admin"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-orange" />
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="keshavanrealty@gmail.com"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-orange" />
                  Password
                </span>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={handlePreFillAdmin}
                    className="text-[11px] font-semibold text-brand-orange hover:underline normal-case"
                  >
                    Use Admin Credentials
                  </button>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  minLength={6}
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 pl-3.5 pr-11 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signin' && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOpen(true);
                      setRecoveryEmail(email || '');
                      setRecoverySuccess(null);
                      setRecoveryError(null);
                    }}
                    className="text-[11px] font-semibold text-brand-orange hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Admin Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-100 flex items-center justify-between">
            <Link to="/" className="text-brand-orange hover:underline">
              &larr; Back to Public Website
            </Link>
            <span className="text-[11px] text-gray-400">Database-enforced RLS</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-brand-charcoal text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-orange" />
                <span>Recover Administrator Access</span>
              </h3>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Enter your registered administrator email address. We will send a secure password reset link to your inbox.
            </p>

            {recoverySuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {recoveryError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{recoveryError}</span>
              </div>
            )}

            {!recoverySuccess ? (
              <form onSubmit={handleSendRecovery} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-orange" />
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="admin@keshavanrealty.com"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingRecovery}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {sendingRecovery ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-charcoal hover:bg-black transition-all"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
