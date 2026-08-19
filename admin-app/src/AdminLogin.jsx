import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "./adminApi.js";
import { saveAdminSession } from "./adminAuth.js";
import "./admin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginAdmin(form);

      if (data.user?.role !== "admin") {
        setError("Admin access required.");
        return;
      }

      saveAdminSession({
        token: data.token,
        user: data.user,
      });

      const destination = location.state?.from || "/";

      navigate(destination, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to sign in. Please check your email and password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <p className="admin-kicker">ALLAVANCHY</p>

        <h1>Admin</h1>

        <p>Sign in to access the administration panel.</p>

        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}

        <form className="admin-form" onSubmit={submitLogin}>
          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              name="password"
              onChange={updateField}
              required
              type="password"
              value={form.password}
            />
          </label>

          <button
            className="admin-primary-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;