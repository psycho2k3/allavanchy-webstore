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
          console.error(
            "Load product error:",
            error,
          );

          if (mounted) {
            setError(
              error?.response?.data
                ?.message ||
                error?.message ||
                "Unable to load product.",
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
   * Submit update.
   */
  const submitProduct =
    async (formData) => {
      setError("");
      setIsSubmitting(true);

      try {
        await updateProduct(
          productId,
          formData,
        );

        navigate("/products");
      } catch (error) {
        console.error(
          "Update product error:",
          error,
        );

        const response =
          error?.response?.data;

        const message =
          response?.errors?.join?.(
            ", ",
          ) ||
          response?.message ||
          error?.message ||
          "Unable to update product.";

        setError(message);

        throw error;
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