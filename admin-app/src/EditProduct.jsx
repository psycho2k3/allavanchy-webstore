import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getApiErrorMessage,
  getProduct,
  updateProduct,
} from "./adminApi.js";

import ProductForm from "./ProductForm.jsx";

import "./admin.css";

function EditProduct() {
  const {
    productId,
  } = useParams();

  const navigate =
    useNavigate();

  const [product, setProduct] =
    useState(null);

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * Load product.
   */
  useEffect(() => {
    let mounted = true;

    const loadProduct =
      async () => {
        setIsLoading(true);
        setError("");

        try {
          const data =
            await getProduct(
              productId,
            );

          if (mounted) {
            setProduct(data);
          }
        } catch (error) {
          if (mounted) {
            setError(
              getApiErrorMessage(
                error,
                "Unable to load product.",
              ),
            );
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  /*
   * Submit update. Errors are re-thrown and shown
   * by ProductForm, which owns submit errors.
   */
  const submitProduct =
    async (formData) => {
      setIsSubmitting(true);

      try {
        await updateProduct(
          productId,
          formData,
        );

        navigate("/products");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">
            Inventory
          </p>

          <h2>
            Edit product
          </h2>
        </div>

        <Link
          className="admin-secondary-button"
          to="/products"
        >
          Back to products
        </Link>
      </div>

      {error && (
        <p className="admin-alert admin-alert-error">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="admin-empty-state">
          Loading product...
        </div>
      ) : product ? (
        <ProductForm
          initialProduct={
            product
          }
          isEditing
          isSubmitting={
            isSubmitting
          }
          onSubmit={
            submitProduct
          }
          submitLabel="Update product"
        />
      ) : (
        <div className="admin-empty-state">
          Product not found.
        </div>
      )}
    </section>
  );
}

export default EditProduct;