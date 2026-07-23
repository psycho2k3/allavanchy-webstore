import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "./adminApi.js";
import ProductForm from "./ProductForm.jsx";
import "./admin.css";

function AddProduct() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitProduct = async (formData) => {
    setError("");
    setIsSubmitting(true);

    try {
      await createProduct(formData);
      navigate("/admin/products");
    } catch (requestError) {
      const response = requestError.response?.data;
      setError(response?.errors?.join(", ") || response?.message || "Unable to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Inventory</p>
          <h2>Add product</h2>
        </div>
        <Link className="admin-secondary-button" to="/admin/products">
          Back to products
        </Link>
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <ProductForm isSubmitting={isSubmitting} onSubmit={submitProduct} submitLabel="Create product" />
    </section>
  );
}

export default AddProduct;
