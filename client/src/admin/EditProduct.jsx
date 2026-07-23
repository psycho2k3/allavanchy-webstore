import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "./adminApi.js";
import ProductForm from "./ProductForm.jsx";
import "./admin.css";

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load product");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const submitProduct = async (formData) => {
    setError("");
    setIsSubmitting(true);

    try {
      await updateProduct(productId, formData);
      navigate("/admin/products");
    } catch (requestError) {
      const response = requestError.response?.data;
      setError(response?.errors?.join(", ") || response?.message || "Unable to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Inventory</p>
          <h2>Edit product</h2>
        </div>
        <Link className="admin-secondary-button" to="/admin/products">
          Back to products
        </Link>
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      {isLoading ? (
        <div className="admin-empty-state">Loading product...</div>
      ) : product ? (
        <ProductForm
          initialProduct={product}
          isEditing
          isSubmitting={isSubmitting}
          onSubmit={submitProduct}
          submitLabel="Update product"
        />
      ) : (
        <div className="admin-empty-state">Product not found.</div>
      )}
    </section>
  );
}

export default EditProduct;
