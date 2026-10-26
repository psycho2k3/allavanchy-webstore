import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createProduct,
} from "./adminApi.js";

import ProductForm from "./ProductForm.jsx";

import "./admin.css";

function AddProduct() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * Errors are re-thrown and shown by ProductForm,
   * which owns submit error display.
   */
  const submitProduct = async (
    formData,
  ) => {
    setIsSubmitting(true);

    try {
      await createProduct(formData);

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
            Add product
          </h2>
        </div>

        <Link
          className="admin-secondary-button"
          to="/products"
        >
          Back to products
        </Link>
      </div>

      <ProductForm
        isEditing={false}
        isSubmitting={
          isSubmitting
        }
        onSubmit={
          submitProduct
        }
        submitLabel="Create product"
      />
    </section>
  );
}

export default AddProduct;