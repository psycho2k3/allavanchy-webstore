import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createCollection,
  getAdminCollection,
  getProducts,
  setCollectionProducts,
  updateCollection,
} from "./adminApi.js";
import "./admin.css";

function CollectionForm() {
  const { collectionId } = useParams();
  const isEditing = Boolean(collectionId);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", subtitle: "" });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const productsData = await getProducts();
        const productList = Array.isArray(productsData) ? productsData : productsData.data || [];
        setAllProducts(productList);

        if (isEditing) {
          const collection = await getAdminCollection(collectionId);
          setForm({ name: collection.name || "", subtitle: collection.subtitle || "" });
          setCurrentImage(collection.image_url || "");
          setSelectedProductIds((collection.products || []).map((product) => product.id));
        }
      } catch (error) {
        setStatus({
          type: "error",
          message: error.response?.data?.message || "Unable to load data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleProduct = (productId) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("subtitle", form.subtitle);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const collection = isEditing
        ? await updateCollection(collectionId, formData)
        : await createCollection(formData);

      await setCollectionProducts(collection.id, selectedProductIds);

      navigate("/collections");
    } catch (error) {
      const response = error.response?.data;
      setStatus({
        type: "error",
        message: response?.errors?.join(", ") || response?.message || "Unable to save collection",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="admin-panel">
        <div className="admin-empty-state">Loading...</div>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Storefront</p>
          <h2>{isEditing ? "Edit collection" : "Add collection"}</h2>
        </div>
        <Link className="admin-secondary-button" to="/collections">
          Back to collections
        </Link>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      <form className="admin-form admin-product-form" onSubmit={submitForm}>
        <label>
          Name
          <input name="name" onChange={updateField} required type="text" value={form.name} />
        </label>

        <label>
          Subtitle
          <textarea name="subtitle" onChange={updateField} rows="2" value={form.subtitle} />
        </label>

        <label>
          Collection image
          <input
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            type="file"
          />
        </label>

        {currentImage && (
          <div className="admin-current-image">
            <img alt={form.name} src={currentImage} />
            <span>Current image</span>
          </div>
        )}

        <div>
          <p className="admin-label">Products in this collection</p>
          {allProducts.length === 0 ? (
            <p className="admin-empty-state">No products available. Add products first.</p>
          ) : (
            <div className="admin-size-options" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              {allProducts.map((product) => (
                <label className="admin-size-option" key={product.id} style={{ width: "100%" }}>
                  <input
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    type="checkbox"
                  />
                  {product.name} — {product.category || "Uncategorized"}
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="admin-primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : isEditing ? "Update collection" : "Create collection"}
        </button>
      </form>
    </section>
  );
}

export default CollectionForm;
