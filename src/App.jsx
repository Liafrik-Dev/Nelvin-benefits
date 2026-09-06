import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from '@/pages/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/i18n';
import UserNotRegisteredError from '@/components/auth/UserNotRegisteredError';
import ScrollToTop from '@/components/shared/ScrollToTop';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Home from '@/pages/public/Home';
import CategoryOffers from '@/pages/public/CategoryOffers';
import CountryOffers from '@/pages/public/CountryOffers';
import AllOffers from '@/pages/public/AllOffers';
import OfferDetail from '@/pages/public/OfferDetail';
import ChoosePlan from '@/pages/public/ChoosePlan';
import Corporate from '@/pages/public/Corporate';
import AdminLayout from '@/components/admin/AdminLayout';

// Route-level code splitting — heavy dashboards/admin bundles load on demand.

const VendorOnboarding = lazy(() => import('@/pages/vendor/VendorOnboarding'));;
const Dashboard = lazy(() => import('@/pages/subscriber/Dashboard'));;
const Benefits = lazy(() => import('@/pages/subscriber/Benefits'));;
const MyOffers = lazy(() => import('@/pages/subscriber/MyOffers'));;
const Profile = lazy(() => import('@/pages/subscriber/Profile'));;
const CorporateSignup = lazy(() => import('@/pages/corporate/CorporateSignup'));;
const CorporateDashboard = lazy(() => import('@/pages/corporate/CorporateDashboard'));;
const Checkout = lazy(() => import('@/pages/subscriber/Checkout'));;
const AdminHome = lazy(() => import('@/pages/admin/AdminHome'));;
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));;
const AdminCompanies = lazy(() => import('@/pages/admin/AdminCompanies'));;
const AdminBusinesses = lazy(() => import('@/pages/admin/AdminBusinesses'));;
const AdminPendingBusinesses = lazy(() => import('@/pages/admin/AdminPendingBusinesses'));;
const AdminOffers = lazy(() => import('@/pages/admin/AdminOffers'));;
const AdminPendingOffers = lazy(() => import('@/pages/admin/AdminPendingOffers'));;
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));;
const AdminCountries = lazy(() => import('@/pages/admin/AdminCountries'));;
const AdminMembershipPlans = lazy(() => import('@/pages/admin/AdminMembershipPlans'));;
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments'));;
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));;
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));;
const AdminSupport = lazy(() => import('@/pages/admin/AdminSupport'));;
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));;
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));;
const AdminRoles = lazy(() => import('@/pages/admin/AdminRoles'));;
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs'));;
const AdminBackups = lazy(() => import('@/pages/admin/AdminBackups'));;

const RouteFallback = () => (
  <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto my-24" />
);
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/category/:categorySlug" element={<CategoryOffers />} />
      <Route path="/country/:countrySlug" element={<CountryOffers />} />
      <Route path="/offers" element={<AllOffers />} />
      <Route path="/offer/:offerId" element={<OfferDetail />} />
      <Route path="/partner" element={<VendorOnboarding />} />
      <Route path="/choose-plan" element={<ChoosePlan />} />
      <Route path="/corporate" element={<Corporate />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/corporate-signup" element={<CorporateSignup />} />
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
          <Route path="/admin/pending-businesses" element={<AdminPendingBusinesses />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/pending-offers" element={<AdminPendingOffers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/countries" element={<AdminCountries />} />
          <Route path="/admin/membership-plans" element={<AdminMembershipPlans />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/backups" element={<AdminBackups />} />
        </Route>
      </Route>
      {/* Add your page Route elements here */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};

function App() {

  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App