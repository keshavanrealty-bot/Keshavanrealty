import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ListProperty } from './pages/ListProperty';
import { NotFound } from './pages/NotFound';
import { QuickEnquiryModal } from './components/QuickEnquiryModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { useWishlist } from './hooks/useWishlist';
import { Property } from './types/property';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminResetPassword } from './pages/admin/AdminResetPassword';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminProperties } from './pages/admin/AdminProperties';
import { AdminPropertyForm } from './pages/admin/AdminPropertyForm';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminBusinessInfo } from './pages/admin/AdminBusinessInfo';
import { AdminAppearance } from './pages/admin/AdminAppearance';
import { AdminPropertySettings } from './pages/admin/AdminPropertySettings';
import { AdminCrmSettings } from './pages/admin/AdminCrmSettings';
import { AdminHomepageEditor } from './pages/admin/AdminHomepageEditor';
import { AdminSeoSettings } from './pages/admin/AdminSeoSettings';
import { AdminTeamSecurity } from './pages/admin/AdminTeamSecurity';
import { AdminMyAccount } from './pages/admin/AdminMyAccount';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSystemStatus } from './pages/admin/AdminSystemStatus';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public layout wrapper that includes Navbar and Footer
function PublicLayout({
  children,
  wishlistCount,
  onOpenWishlist,
}: {
  children: React.ReactNode;
  wishlistCount: number;
  onOpenWishlist: () => void;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar wishlistCount={wishlistCount} onOpenWishlist={onOpenWishlist} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function App() {
  const { wishlistIds, wishlistCount, toggleWishlist } = useWishlist();

  // Quick enquiry modal state
  const [quickEnquireProperty, setQuickEnquireProperty] = useState<Property | null>(null);
  const [isQuickEnquireOpen, setIsQuickEnquireOpen] = useState(false);

  // Wishlist drawer state
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleOpenQuickEnquire = (property: Property) => {
    setQuickEnquireProperty(property);
    setIsQuickEnquireOpen(true);
  };

  const handleCloseQuickEnquire = () => {
    setIsQuickEnquireOpen(false);
    setQuickEnquireProperty(null);
  };

  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<AdminPropertyForm />} />
              <Route path="properties/:id/edit" element={<AdminPropertyForm />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="business-info" element={<AdminBusinessInfo />} />
              <Route path="appearance" element={<AdminAppearance />} />
              <Route path="property-settings" element={<AdminPropertySettings />} />
              <Route path="crm-settings" element={<AdminCrmSettings />} />
              <Route path="homepage-editor" element={<AdminHomepageEditor />} />
              <Route path="seo-settings" element={<AdminSeoSettings />} />
              <Route path="account" element={<AdminMyAccount />} />
              <Route path="team" element={<AdminTeamSecurity />} />
              <Route path="system-status" element={<AdminSystemStatus />} />
            </Route>

            {/* Public Website Routes */}
            <Route
              path="/*"
              element={
                <PublicLayout
                  wishlistCount={wishlistCount}
                  onOpenWishlist={() => setIsWishlistOpen(true)}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Home
                          wishlistIds={wishlistIds}
                          onToggleWishlist={toggleWishlist}
                          onQuickEnquire={handleOpenQuickEnquire}
                        />
                      }
                    />
                    <Route
                      path="/properties"
                      element={
                        <Properties
                          wishlistIds={wishlistIds}
                          onToggleWishlist={toggleWishlist}
                          onQuickEnquire={handleOpenQuickEnquire}
                        />
                      }
                    />
                    <Route
                      path="/properties/:id"
                      element={
                        <PropertyDetails
                          wishlistIds={wishlistIds}
                          onToggleWishlist={toggleWishlist}
                          onQuickEnquire={handleOpenQuickEnquire}
                        />
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/list-property" element={<Navigate to="/contact" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PublicLayout>
              }
            />
          </Routes>

          {/* Global Quick Enquiry Modal */}
          <QuickEnquiryModal
            property={quickEnquireProperty}
            isOpen={isQuickEnquireOpen}
            onClose={handleCloseQuickEnquire}
          />

          {/* Global Wishlist Drawer */}
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
          />
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;
