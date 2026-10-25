import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Building,
  PlusCircle,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Palette,
  Building2,
  SlidersHorizontal,
  Home,
  Search,
  User,
  Shield,
  Activity,
  BarChart3,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Protect route
  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login', { replace: true, state: { from: location } });
    }
  }, [user, isAdmin, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-300">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const navGroups = [
    {
      title: 'Platform Overview',
      items: [
        { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Analytics & Insights', path: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Property Catalog',
      items: [
        { name: 'All Properties', path: '/admin/properties', icon: Building, exact: true },
        { name: 'Add New Property', path: '/admin/properties/new', icon: PlusCircle },
      ],
    },
    {
      title: 'Leads & Inquiries',
      items: [
        { name: 'Inquiries & Submissions', path: '/admin/enquiries', icon: MessageSquare },
      ],
    },
    {
      title: 'Website Control Center',
      items: [
        { name: 'Business Information', path: '/admin/business-info', icon: Building2 },
        { name: 'Appearance & Branding', path: '/admin/appearance', icon: Palette },
        { name: 'Property Display', path: '/admin/property-settings', icon: SlidersHorizontal },
        { name: 'Enquiry & CRM', path: '/admin/crm-settings', icon: MessageCircle },
        { name: 'Homepage Editor', path: '/admin/homepage-editor', icon: Home },
        { name: 'SEO & Google Tags', path: '/admin/seo-settings', icon: Search },
      ],
    },
    {
      title: 'Administration',
      items: [
        { name: 'My Account', path: '/admin/account', icon: User },
        { name: 'Team & Security', path: '/admin/team', icon: Shield },
        { name: 'System Status', path: '/admin/system-status', icon: Activity },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-brand-charcoal text-white shrink-0 border-r border-white/10 select-none max-h-screen sticky top-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-charcoal-surface border border-brand-orange/40 p-1 flex items-center justify-center shrink-0">
            <img src="/keshavan-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight flex items-center gap-1 font-display">
              KESHAVAN <span className="text-brand-orange">ADMIN</span>
            </span>
            <span className="text-[10px] text-gray-400 block tracking-widest uppercase">
              Control Center
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="p-4 space-y-5 flex-1">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 block">
                {group.title}
              </span>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-orange text-white shadow-md'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-brand-charcoal-surface">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">Live</span>
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
              aria-label="Toggle Navigation"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base sm:text-lg font-bold text-brand-charcoal font-display">
              Keshavan Realty Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/account"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 hover:border-brand-orange transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-xs">{user?.email}</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              <ExternalLink className="w-3 h-3 text-brand-orange" />
              <span>View Site</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors sm:hidden"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-brand-charcoal text-white p-4 space-y-4 border-b border-white/10 animate-fadeIn max-h-[85vh] overflow-y-auto">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 block">
                  {group.title}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                        isActive ? 'bg-brand-orange text-white' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <Link to="/" target="_blank" className="text-brand-orange font-bold">
                View Public Website &rarr;
              </Link>
              <button onClick={() => signOut()} className="text-rose-400 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
