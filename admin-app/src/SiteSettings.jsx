import { useEffect, useState } from "react";
import {
  getAdminSettings,
  getApiErrorMessage,
  updateHeroImage,
  updateLandingImage,
  updateSettings,
} from "./adminApi.js";
import { compressImage, formatFileSize, MAX_UPLOAD_FILE_SIZE } from "./imageCompression.js";
import "./admin.css";

function SiteSettings() {
  const [form, setForm] = useState({
    site_mode: "full",
    landing_button_label: "",
    hero_eyebrow: "",
    hero_heading: "",
    hero_subtext: "",
    hero_button_label: "",
  });
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLanding, setIsUploadingLanding] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);

    try {
      const data = await getAdminSettings();
      setSettings(data);
      setForm({
        site_mode: data.site_mode || "full",
        landing_button_label: data.landing_button_label || "",
        hero_eyebrow: data.hero_eyebrow || "",
        hero_heading: data.hero_heading || "",
        hero_subtext: data.hero_subtext || "",
        hero_button_label: data.hero_button_label || "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, "Unable to load settings"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const updatedSettings = await updateSettings(form);
      setSettings(updatedSettings);
      setStatus({ type: "success", message: "Settings saved" });
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, "Unable to save settings"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Compresses large photos, enforces the 4 MB limit, then uploads. The input
  // is reset so the same file can be picked again after an error.
  const uploadImage = async (event, { upload, setIsUploading, successMessage, fallback }) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsUploading(true);
    setStatus({ type: "", message: "" });

    try {
      const compressed = await compressImage(file);

      if (compressed.size > MAX_UPLOAD_FILE_SIZE) {
        setStatus({
          type: "error",
          message: `${file.name} is ${formatFileSize(compressed.size)} after compression. Images must be 4 MB or smaller.`,
        });
        return;
      }

      const updatedSettings = await upload(compressed);
      setSettings(updatedSettings);
      setStatus({ type: "success", message: successMessage });
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, fallback),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLandingImage = (event) =>
    uploadImage(event, {
      upload: updateLandingImage,
      setIsUploading: setIsUploadingLanding,
      successMessage: "Landing image updated",
      fallback: "Unable to upload landing image",
    });

  const handleHeroImage = (event) =>
    uploadImage(event, {
      upload: updateHeroImage,
      setIsUploading: setIsUploadingHero,
      successMessage: "Hero image updated",
      fallback: "Unable to upload hero image",
    });

  if (isLoading) {
    return (
      <section className="admin-panel">
        <div className="admin-empty-state">Loading site settings...</div>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Storefront</p>
          <h2>Site Settings</h2>
        </div>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      <form className="admin-form admin-product-form" onSubmit={submitForm}>
        <label>
          Site mode
          <select className="admin-select" name="site_mode" onChange={updateField} value={form.site_mode}>
            <option value="full">Full Homepage</option>
            <option value="landing">Landing Page</option>
          </select>
        </label>

        <p className="admin-label" style={{ marginTop: "12px" }}>
          Landing page
        </p>

        <label>
          Discover button label
          <input
            name="landing_button_label"
            onChange={updateField}
            type="text"
            value={form.landing_button_label}
          />
        </label>

        <label>
          Landing image
          <input accept="image/*" disabled={isUploadingLanding} onChange={handleLandingImage} type="file" />
        </label>

        {settings?.landing_image_url && (
          <div className="admin-current-image">
            <img alt="Landing page" src={settings.landing_image_url} />
            <span>{isUploadingLanding ? "Uploading..." : "Current landing image"}</span>
          </div>
        )}

        <p className="admin-label" style={{ marginTop: "24px" }}>
          Homepage hero
        </p>

        <div className="admin-form-grid">
          <label>
            Eyebrow text
            <input name="hero_eyebrow" onChange={updateField} type="text" value={form.hero_eyebrow} />
          </label>

          <label>
            Button label
            <input name="hero_button_label" onChange={updateField} type="text" value={form.hero_button_label} />
          </label>
        </div>

        <label>
          Heading
          <input name="hero_heading" onChange={updateField} type="text" value={form.hero_heading} />
        </label>

        <label>
          Subtext
          <textarea name="hero_subtext" onChange={updateField} rows="3" value={form.hero_subtext} />
        </label>

        <label>
          Hero image
          <input accept="image/*" disabled={isUploadingHero} onChange={handleHeroImage} type="file" />
        </label>

        {settings?.hero_image_url && (
          <div className="admin-current-image">
            <img alt="Homepage hero" src={settings.hero_image_url} />
            <span>{isUploadingHero ? "Uploading..." : "Current hero image"}</span>
          </div>
        )}

        <button className="admin-primary-button" disabled={isSaving} type="submit">
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}

export default SiteSettings;
