import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "./adminApi.js";

import "./admin.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    setIsLoading(true);

    try {
      setStatus({
        type: "",
        message: "",
      });

      const data = await getProducts();

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setProducts(productList);
    } catch (error) {
      console.error("Load products error:", error);

      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load products.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      return [product.name, product.category]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(normalizedSearch),
        );
    });
  }, [products, searchTerm]);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const removeProduct = async (product) => {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);

    setStatus({
      type: "",
      message: "",
    });

    try {
      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id,
        ),
      );

      setStatus({
        type: "success",
        message: `"${product.name}" was deleted successfully.`,
      });
    } catch (error) {
      console.error("Delete product error:", error);

      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to delete product.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // CHANGE STOCK
  // =====================================================

  const changeStock = async (product, nextStock) => {
    if (nextStock < 0) {
      return;
    }

    if (updatingStockId !== null) {
      return;
    }

    setUpdatingStockId(product.id);

    setStatus({
      type: "",
      message: "",
    });

    try {
      /*
       * updateProduct() expects FormData.
       * Do not pass a normal JavaScript object here.
       */
      const formData = new FormData();

      formData.append(
        "stock",
        String(nextStock),
      );

      const updatedProduct = await updateProduct(
        product.id,
        formData,
      );

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? updatedProduct
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Update stock error:",
        error,
      );

      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to update stock.",
      });
    } finally {
      setUpdatingStockId(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="admin-panel">

      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">
            Inventory
          </p>

          <h2>
            Products
          </h2>
        </div>

        <Link
          className="admin-primary-button"
          to="/products/new"
        >
          Add product
        </Link>
      </div>

      {/* =================================================
          SEARCH TOOLBAR
      ================================================== */}

      <div className="admin-toolbar">
        <input
          aria-label="Search products"
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search by name or category"
          type="search"
          value={searchTerm}
        />

        <p>
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1
            ? "product"
            : "products"}
        </p>
      </div>

      {/* =================================================
          STATUS MESSAGE
      ================================================== */}

      {status.message && (
        <p
          className={`admin-alert admin-alert-${status.type}`}
        >
          {status.message}
        </p>
      )}

      {/* =================================================
          LOADING
      ================================================== */}

      {isLoading ? (
        <div className="admin-empty-state">
          Loading products...
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="admin-empty-state">
          No products found.
        </div>
      ) : (
        /* =================================================
           PRODUCT TABLE
        ================================================== */

        <div className="admin-table-wrap">
          <table className="admin-table">

            <thead>
              <tr>
                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {visibleProducts.map((product) => {

                const stock = Number(
                  product.stock || 0,
                );

                const isDeleting =
                  deletingId === product.id;

                const isUpdatingStock =
                  updatingStockId === product.id;

                return (
                  <tr
                    key={product.id}
                  >

                    {/* =================================
                        PRODUCT
                    ================================== */}

                    <td>
                      <div className="admin-product-cell">

                        {product.image_url ? (
                          <img
                            alt={product.name || "Product"}
                            src={product.image_url}
                          />
                        ) : (
                          <div
                            className="admin-product-image-placeholder"
                            aria-hidden="true"
                          >
                            No image
                          </div>
                        )}

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            ID {product.id}
                          </span>
                        </div>

                      </div>
                    </td>

                    {/* =================================
                        CATEGORY
                    ================================== */}

                    <td>
                      {product.category ||
                        "Uncategorized"}
                    </td>

                    {/* =================================
                        PRICE
                    ================================== */}

                    <td>
                      {currencyFormatter.format(
                        Number(
                          product.price || 0,
                        ),
                      )}
                    </td>

                    {/* =================================
                        STOCK
                    ================================== */}

                    <td>
                      <div className="admin-stock-control">

                        <button
                          disabled={
                            stock <= 0 ||
                            isUpdatingStock ||
                            isDeleting
                          }
                          onClick={() =>
                            changeStock(
                              product,
                              stock - 1,
                            )
                          }
                          type="button"
                          aria-label={`Decrease stock for ${product.name}`}
                        >
                          -
                        </button>

                        <span
                          className={
                            stock <= 5
                              ? "admin-stock-low"
                              : ""
                          }
                        >
                          {stock}
                        </span>

                        <button
                          disabled={
                            isUpdatingStock ||
                            isDeleting
                          }
                          onClick={() =>
                            changeStock(
                              product,
                              stock + 1,
                            )
                          }
                          type="button"
                          aria-label={`Increase stock for ${product.name}`}
                        >
                          +
                        </button>

                      </div>
                    </td>

                    {/* =================================
                        ACTIONS
                    ================================== */}

                    <td>
                      <div className="admin-actions">

                        {/* EDIT */}

                        <Link
                          to={`/products/${product.id}/edit`}
                          aria-label={`Edit ${product.name}`}
                        >
                          Edit
                        </Link>

                        {/* DELETE */}

                        <button
                          disabled={
                            isDeleting ||
                            isUpdatingStock
                          }
                          onClick={() =>
                            removeProduct(
                              product,
                            )
                          }
                          type="button"
                          aria-label={`Delete ${product.name}`}
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ProductTable;