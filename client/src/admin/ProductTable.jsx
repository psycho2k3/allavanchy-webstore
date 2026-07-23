import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts, updateProduct } from "./adminApi.js";
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

  const loadProducts = async () => {
    setIsLoading(true);

    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to load products",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return products;

    return products.filter((product) => {
      return [product.name, product.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [products, searchTerm]);

  const removeProduct = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id));
      setStatus({
        type: "success",
        message: "Product deleted",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to delete product",
      });
    }
  };

  const changeStock = async (product, nextStock) => {
    if (nextStock < 0) return;

    try {
      const updatedProduct = await updateProduct(product.id, {
        stock: nextStock,
      });
      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? updatedProduct : item)),
      );
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to update stock",
      });
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Inventory</p>
          <h2>Products</h2>
        </div>
        <Link className="admin-primary-button" to="/admin/products/new">
          Add product
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          aria-label="Search products"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or category"
          type="search"
          value={searchTerm}
        />
        <p>{visibleProducts.length} products</p>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      {isLoading ? (
        <div className="admin-empty-state">Loading products...</div>
      ) : visibleProducts.length === 0 ? (
        <div className="admin-empty-state">No products found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img alt="" src={product.image_url} />
                      <div>
                        <strong>{product.name}</strong>
                        <span>ID {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.category || "Uncategorized"}</td>
                  <td>{currencyFormatter.format(Number(product.price || 0))}</td>
                  <td>
                    <div className="admin-stock-control">
                      <button onClick={() => changeStock(product, Number(product.stock) - 1)} type="button">
                        -
                      </button>
                      <span className={Number(product.stock) <= 5 ? "admin-stock-low" : ""}>
                        {product.stock}
                      </span>
                      <button onClick={() => changeStock(product, Number(product.stock) + 1)} type="button">
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
                      <button onClick={() => removeProduct(product)} type="button">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ProductTable;
