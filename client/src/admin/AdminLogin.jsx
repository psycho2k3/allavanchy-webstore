import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "./adminApi.js";
import { saveAdminSession } from "./adminAuth.js";
import "./admin.css";

function AdminLogin() {
  const navigate = useNavigate();
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
        setError("Admin access required");
        return;
      }

      saveAdminSession({
        token: data.token,
        user: data.user,
      });
      navigate("/admin/products");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <p className="admin-kicker">ALLAVANCHY Admin</p>
        <h1>Sign in</h1>
        <form className="admin-form" onSubmit={submitLogin}>
          {error && <p className="admin-alert">{error}</p>}

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

          <button className="admin-primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
