import { db } from "@/services/api/base44Client";

import React, { createContext, useState, useContext, useEffect } from 'react';

import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

/**
 * Minimal axios-like client built on native fetch. The Base44 platform injects
 * an SDK but does not provide `createAxiosClient`; without this helper the
 * public-settings check used to throw a ReferenceError on every boot, which
 * silently left even authenticated users in a signed-out state.
 *
 * Supports the options used by this file: `baseURL`, `headers`, `token`
 * (sent as `Authorization: Bearer <token>`) and `interceptResponses` (see below).
 */
function createAxiosClient({ baseURL = "", headers = {}, token = null }) {
  const buildUrl = (url) => {
    if (/^https?:\/\//i.test(url)) return url;
    return `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  const request = async (method, url, options = {}) => {
    const { interceptResponses, ...fetchOptions } = options;
    const mergedHeaders = { ...headers, ...(fetchOptions.headers || {}) };
    if (token) mergedHeaders.Authorization = `Bearer ${token}`;

    let res;
    try {
      res = await fetch(buildUrl(url), {
        method,
        credentials: "include",
        ...fetchOptions,
        headers: mergedHeaders,
      });
    } catch (err) {
      // Network failure — surfaces a fake "axios-like" error for the callers.
      const networkError = new Error(err.message || "Network request failed");
      networkError.status = 0;
      networkError.data = null;
      throw networkError;
    }

    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const error = new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  return {
    get: (url, opts) => request("GET", url, opts),
    post: (url, body, opts) =>
      request("POST", url, {
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        ...opts,
      }),
    put: (url, body, opts) =>
      request("PUT", url, {
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        ...opts,
      }),
    patch: (url, body, opts) =>
      request("PATCH", url, {
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        ...opts,
      }),
    delete: (url, opts) => request("DELETE", url, opts),
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      });
      
      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token || (await db.auth.isAuthenticated())) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        let handled = false;
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          handled = true;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else if (appError.data && typeof appError.data === 'object' && appError.status !== undefined) {
          // Structured API error (JSON) we don't specifically map → generic app error.
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }

        // When the public-settings call fails for transport reasons (app is
        // hosted outside the Base44 host, offline, CORS, HTML error pages…),
        // still resolve auth from the injected SDK/fallback so a valid session
        // is not lost.
        if (!handled) {
          if (appParams.token || (await db.auth.isAuthenticated())) {
            await checkUserAuth();
          } else {
            setIsLoadingAuth(false);
            setIsAuthenticated(false);
            setAuthChecked(true);
          }
        }
        setIsLoadingPublicSettings(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const linkUserToCompany = async (currentUser) => {
    try {
      const domain = (currentUser.email || "").split("@")[1]?.toLowerCase();
      if (!domain) return currentUser;
      // Find any approved company that matches this email domain.
      // Public-read covers approved companies even for non-creators.
      const matches = await db.entities.Company
        .filter({ status: "approved", email_domain: domain }, "-created_date", 5)
        .catch(() => []);
      if (!matches || matches.length === 0) return currentUser;
      const company = matches[0];

      // Already linked — no-op.
      if (currentUser.company_id === company.id) return currentUser;

      await db.auth.updateMe({ company_id: company.id, account_type: "corporate" });
      const updated = { ...currentUser, company_id: company.id, account_type: "corporate" };

      // Upsert the Employee record so HR dashboards see the user as active.
      try {
        const existing = await db.entities.Employee.filter(
          { company_id: company.id, user_email: (currentUser.email || "").toLowerCase() },
          "-created_date",
          5
        ).catch(() => []);
        if (existing && existing.length > 0) {
          await db.entities.Employee.update(existing[0].id, {
            user_id: currentUser.id,
            user_name: currentUser.full_name,
            status: "active",
            joined_date: new Date().toISOString().slice(0, 10),
          });
        } else {
          await db.entities.Employee.create({
            user_id: currentUser.id,
            user_email: (currentUser.email || "").toLowerCase(),
            user_name: currentUser.full_name || "",
            company_id: company.id,
            company_name: company.name,
            status: "active",
            joined_date: new Date().toISOString().slice(0, 10),
          });
        }
        // Bump seat count without exceeding purchased seats for self-serve plans.
        if ((company.seats_used || 0) < (company.seats_purchased || 0)) {
          await db.entities.Company.update(company.id, {
            seats_used: (company.seats_used || 0) + 1,
          }).catch(() => {});
        }
      } catch {
        /* Employee upsert failures should never block login. */
      }
      return updated;
    } catch {
      return currentUser;
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      let currentUser = await db.auth.me();
      if (!currentUser) {
        // No active session — treat as signed out (not an error).
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
        return;
      }
      // Domain-based auto-join for corporate users without a linked company.
      if (!currentUser.company_id) {
        currentUser = await linkUserToCompany(currentUser);
      }
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      db.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      db.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    db.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};