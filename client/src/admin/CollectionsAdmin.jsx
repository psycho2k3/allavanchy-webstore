import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCollection, getAdminCollections } from "./adminApi.js";
import "./admin.css";

function CollectionsAdmin() {
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const loadCollections = async () => {
    setIsLoading(true);

    try {
      const data = await getAdminCollections();
      setCollections(data);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to load collections",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const removeCollection = async (collection) => {
    const confirmed = window.confirm(`Delete "${collection.name}"?`);

    if (!confirmed) return;

    try {
      await deleteCollection(collection.id);
      setCollections((current) => current.filter((item) => item.id !== collection.id));
      setStatus({ type: "success", message: "Collection deleted" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to delete collection",
      });
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Storefront</p>
          <h2>Collections</h2>
        </div>
        <Link className="admin-primary-button" to="/admin/collections/new">
          Add collection
        </Link>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      {isLoading ? (
        <div className="admin-empty-state">Loading collections...</div>
      ) : collections.length === 0 ? (
        <div className="admin-empty-state">No collections yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection.id}>
                  <td>
                    <div className="admin-product-cell">
                      {collection.image_url && <img alt="" src={collection.image_url} />}
                      <div>
                        <strong>{collection.name}</strong>
                        <span>{collection.subtitle}</span>
                      </div>
                    </div>
                  </td>
                  <td>{collection.product_count}</td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/collections/${collection.id}/edit`}>Edit</Link>
                      <button onClick={() => removeCollection(collection)} type="button">
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

export default CollectionsAdmin;