import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { loginUrlWithReturnTo } from '@/lib/authReturnTo';
import UserNotRegisteredError from '@/components/auth/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#F1F1F1] border-t-[#C99000] rounded-full animate-spin"></div>
  </div>
);

/**
 * Where to send a signed-out visitor who tried to open a protected page.
 *
 * The destination rides along in `returnTo` so login can hand them back to the
 * page they actually wanted. Without this the visitor was always dropped on the
 * portal home, which made every deep link look broken.
 */
function SignInRedirect() {
  return <Navigate to={loginUrlWithReturnTo()} replace />;
}

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement ?? <SignInRedirect />;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement ?? <SignInRedirect />;
  }

  return <Outlet />;
}
