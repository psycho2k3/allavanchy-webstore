import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/userApi.js';
import {
  clearUserSession,
  getStoredUser,
  isUserAuthenticated,
  saveUserSession,
} from '../services/userAuth.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [authError, setAuthError] = useState('');

  // Runs only after user has updated AND any child providers (cart, wishlist)
  // have already switched their storage over to the new user.
  useEffect(() => {
    if (user && pendingAction) {
      pendingAction();
      setIsAuthModalOpen(false);
      setPendingAction(null);
      setAuthError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingAction]);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
    setAuthError('');
  }, []);

  const requireAuth = useCallback((action) => {
    if (isUserAuthenticated()) {
      action();
      return;
    }

    setPendingAction(() => action);
    setAuthError('');
    setIsAuthModalOpen(true);
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthError('');
    try {
      const data = await loginUser(credentials);
      saveUserSession({ token: data.token, user: data.user });
      setUser(data.user);
      return true;
    } catch (requestError) {
      setAuthError(requestError.response?.data?.message || 'Unable to sign in');
      return false;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError('');
    try {
      await registerUser(payload);
      // Backend registration does not return a token, so log in immediately after.
      return await login({ email: payload.email, password: payload.password });
    } catch (requestError) {
      const response = requestError.response?.data;
      setAuthError(response?.errors?.join(', ') || response?.message || 'Unable to create account');
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    clearUserSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthModalOpen,
      authError,
      login,
      register,
      logout,
      requireAuth,
      closeAuthModal,
    }),
    [user, isAuthModalOpen, authError, login, register, logout, requireAuth, closeAuthModal],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}