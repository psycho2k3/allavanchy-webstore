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

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const user = getAdminUser();

  return Boolean(token && user?.role === "admin");
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};