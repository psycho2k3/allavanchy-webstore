const TOKEN_KEY = "allavanchy_admin_token";
const USER_KEY = "allavanchy_admin_user";

export const saveAdminSession = ({ token, user }) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAdminToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getAdminUser = () => {
  const storedUser = sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

// Reads the `exp` claim (seconds since epoch) without verifying the signature;
// the server still verifies every request. Returns null for malformed tokens.
const getTokenExpiry = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const claims = JSON.parse(atob(padded));

    return typeof claims.exp === "number" ? claims.exp : null;
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const user = getAdminUser();

  if (!token || user?.role !== "admin") {
    return false;
  }

  const expiry = getTokenExpiry(token);

  if (expiry === null || expiry * 1000 <= Date.now()) {
    clearAdminSession();
    return false;
  }

  return true;
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};