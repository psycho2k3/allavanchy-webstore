import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "./adminApi.js";
import "./admin.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);

    try {
      const data = await getUsers({
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(data.data || []);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to load users",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter]);

  const submitSearch = (event) => {
    event.preventDefault();
    loadUsers();
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Accounts</p>
          <h2>Users</h2>
        </div>
      </div>

      <form className="admin-toolbar admin-toolbar-wrap" onSubmit={submitSearch}>
        <input
          aria-label="Search users"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or email"
          type="search"
          value={searchTerm}
        />

        <div className="admin-filter-group">
          <select
            aria-label="Filter by role"
            className="admin-select"
            onChange={(event) => setRoleFilter(event.target.value)}
            value={roleFilter}
          >
            <option value="">All roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <select
            aria-label="Filter by status"
            className="admin-select"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </form>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      {isLoading ? (
        <div className="admin-empty-state">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty-state">No users found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${user.status || "active"}`}>
                      {user.status || "active"}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/users/${user.id}`}>View</Link>
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

export default Users;