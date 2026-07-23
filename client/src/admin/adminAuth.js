const TOKEN_KEY = "allavanchy_admin_token";
const USER_KEY = "allavanchy_admin_user";

export const saveAdminSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAdminToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAdminUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) return null;

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
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
