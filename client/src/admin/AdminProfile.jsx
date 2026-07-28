import { useState } from "react";
import { updateAdminProfile } from "./adminApi.js";
import { getAdminUser } from "./adminAuth.js";
import "./admin.css";

function AdminProfile() {
  const adminUser = getAdminUser();
  const [form, setForm] = useState({
    name: adminUser?.name || "",
    email: adminUser?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      await updateAdminProfile({
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      });

      setStatus({ type: "success", message: "Profile updated" });
      setForm((currentForm) => ({ ...currentForm, currentPassword: "", newPassword: "" }));
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Account</p>
          <h2>My Profile</h2>
        </div>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      <form className="admin-form admin-product-form" onSubmit={submitForm}>
        <div className="admin-form-grid">
          <label>
            Name
            <input name="name" onChange={updateField} required type="text" value={form.name} />
          </label>

          <label>
            Email
            <input name="email" onChange={updateField} required type="email" value={form.email} />
          </label>
        </div>

        <p className="admin-label" style={{ marginTop: "8px" }}>
          Leave password fields blank to keep your current password.
        </p>

        <div className="admin-form-grid">
          <label>
            Current password
            <input
              autoComplete="current-password"
              name="currentPassword"
              onChange={updateField}
              type="password"
              value={form.currentPassword}
            />
          </label>

          <label>
            New password
            <input
              autoComplete="new-password"
              name="newPassword"
              onChange={updateField}
              type="password"
              value={form.newPassword}
            />
          </label>
        </div>

        <button className="admin-primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}

export default AdminProfile;