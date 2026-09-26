import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import BusinessLayout from '@/components/business/BusinessLayout';
import { PlatformWorkflowProvider } from '@/context/PlatformWorkflowContext';

// Subscriber / Employee Pages
const VendorOnboarding = lazy(() => import('@/pages/vendor/VendorOnboarding'));
const Dashboard = lazy(() => import('@/pages/subscriber/Dashboard'));
const Explore = lazy(() => import('@/pages/subscriber/Explore'));
const Categories = lazy(() => import('@/pages/subscriber/Categories'));
const Marketplace = lazy(() => import('@/pages/subscriber/Marketplace'));
const Search = lazy(() => import('@/pages/subscriber/Search'));
const Favorites = lazy(() => import('@/pages/subscriber/Favorites'));
const Nearby = lazy(() => import('@/pages/subscriber/Nearby'));
const Rewards = lazy(() => import('@/pages/subscriber/Rewards'));
const Wallet = lazy(() => import('@/pages/subscriber/Wallet'));
const Cashback = lazy(() => import('@/pages/subscriber/Cashback'));
const Vouchers = lazy(() => import('@/pages/subscriber/Vouchers'));
const FlexibleBenefits = lazy(() => import('@/pages/subscriber/FlexibleBenefits'));
const Wellness = lazy(() => import('@/pages/subscriber/Wellness'));
const FinancialWellness = lazy(() => import('@/pages/subscriber/FinancialWellness'));
const Lifestyle = lazy(() => import('@/pages/subscriber/Lifestyle'));
const Notifications = lazy(() => import('@/pages/subscriber/Notifications'));
const Settings = lazy(() => import('@/pages/subscriber/Settings'));
const Support = lazy(() => import('@/pages/subscriber/Support'));
const Benefits = lazy(() => import('@/pages/subscriber/Benefits'));
const MyOffers = lazy(() => import('@/pages/subscriber/MyOffers'));
const Profile = lazy(() => import('@/pages/subscriber/Profile'));
const Checkout = lazy(() => import('@/pages/subscriber/Checkout'));

// Corporate Pages
const CorporateSignup = lazy(() => import('@/pages/corporate/CorporateSignup'));
const CorporateDashboard = lazy(() => import('@/pages/corporate/CorporateDashboard'));

// Business / Partner Pages
const BusinessDashboard = lazy(() => import('@/pages/business/BusinessDashboard'));
const BusinessProfile = lazy(() => import('@/pages/business/BusinessProfile'));
const BusinessLocations = lazy(() => import('@/pages/business/BusinessLocations'));
const BusinessOffers = lazy(() => import('@/pages/business/BusinessOffers'));
const BusinessCreateOffer = lazy(() => import('@/pages/business/BusinessCreateOffer'));
const BusinessCategories = lazy(() => import('@/pages/business/BusinessCategories'));
const BusinessPromoCodes = lazy(() => import('@/pages/business/BusinessPromoCodes'));
const BusinessQRCodes = lazy(() => import('@/pages/business/BusinessQRCodes'));
const BusinessRedemptions = lazy(() => import('@/pages/business/BusinessRedemptions'));
const BusinessCustomers = lazy(() => import('@/pages/business/BusinessCustomers'));
const BusinessCampaigns = lazy(() => import('@/pages/business/BusinessCampaigns'));
const BusinessPerformance = lazy(() => import('@/pages/business/BusinessPerformance'));
const BusinessAnalytics = lazy(() => import('@/pages/business/BusinessAnalytics'));
const BusinessPayouts = lazy(() => import('@/pages/business/BusinessPayouts'));
const BusinessTeam = lazy(() => import('@/pages/business/BusinessTeam'));
const BusinessSettings = lazy(() => import('@/pages/business/BusinessSettings'));
const BusinessSupport = lazy(() => import('@/pages/business/BusinessSupport'));

// Admin Pages
const AdminHome = lazy(() => import('@/pages/admin/AdminHome'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminCompanies = lazy(() => import('@/pages/admin/AdminCompanies'));
const AdminBusinesses = lazy(() => import('@/pages/admin/AdminBusinesses'));
const AdminPendingBusinesses = lazy(() => import('@/pages/admin/AdminPendingBusinesses'));
const AdminOffers = lazy(() => import('@/pages/admin/AdminOffers'));
const AdminPendingOffers = lazy(() => import('@/pages/admin/AdminPendingOffers'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminPartnerLogos = lazy(() => import('@/pages/admin/AdminPartnerLogos'));
const AdminCountries = lazy(() => import('@/pages/admin/AdminCountries'));
const AdminMembershipPlans = lazy(() => import('@/pages/admin/AdminMembershipPlans'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));
const AdminSupport = lazy(() => import('@/pages/admin/AdminSupport'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminRoles = lazy(() => import('@/pages/admin/AdminRoles'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs'));
const AdminBackups = lazy(() => import('@/pages/admin/AdminBackups'));

const RouteFallback = () => (
  <div className="w-8 h-8 border-4 border-[#F1F1F1] border-t-[#C99000] rounded-full animate-spin mx-auto my-24" />
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F1F1F1] border-t-[#C99000] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

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
      {/* No unauthenticatedElement: ProtectedRoute's own redirect carries the
          attempted destination in returnTo so login can send the visitor back. */}
      <Route element={<ProtectedRoute />}>
        {/* Subscriber / Employee Portal */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/cashback" element={<Cashback />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/flexible-benefits" element={<FlexibleBenefits />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/financial-wellness" element={<FinancialWellness />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/profile" element={<Profile />} />

        {/* Corporate / Employer Portal */}
        <Route path="/corporate-signup" element={<CorporateSignup />} />
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />

        {/* Business / Partner Portal */}
        <Route element={<BusinessLayout />}>
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/profile" element={<BusinessProfile />} />
          <Route path="/business/locations" element={<BusinessLocations />} />
          <Route path="/business/offers" element={<BusinessOffers />} />
          <Route path="/business/offers/new" element={<BusinessCreateOffer />} />
          <Route path="/business/categories" element={<BusinessCategories />} />
          <Route path="/business/promo-codes" element={<BusinessPromoCodes />} />
          <Route path="/business/qr-codes" element={<BusinessQRCodes />} />
          <Route path="/business/redemptions" element={<BusinessRedemptions />} />
          <Route path="/business/customers" element={<BusinessCustomers />} />
          <Route path="/business/campaigns" element={<BusinessCampaigns />} />
          <Route path="/business/performance" element={<BusinessPerformance />} />
          <Route path="/business/analytics" element={<BusinessAnalytics />} />
          <Route path="/business/payouts" element={<BusinessPayouts />} />
          <Route path="/business/team" element={<BusinessTeam />} />
          <Route path="/business/settings" element={<BusinessSettings />} />
          <Route path="/business/support" element={<BusinessSupport />} />
        </Route>

        {/* Admin Portal */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
          <Route path="/admin/pending-businesses" element={<AdminPendingBusinesses />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/pending-offers" element={<AdminPendingOffers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/partner-logos" element={<AdminPartnerLogos />} />
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
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <LanguageProvider>
      <PlatformWorkflowProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </PlatformWorkflowProvider>
    </LanguageProvider>
  )
}

export default App