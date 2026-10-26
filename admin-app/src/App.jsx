import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import AddProduct from "./AddProduct.jsx";
import AdminLayout from "./AdminLayout.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminProfile from "./AdminProfile.jsx";
import CollectionForm from "./CollectionForm.jsx";
import CollectionsAdmin from "./CollectionsAdmin.jsx";
import Dashboard from "./Dashboard.jsx";
import EditProduct from "./EditProduct.jsx";
import OrderDetail from "./OrderDetail.jsx";
import Orders from "./Orders.jsx";
import ProductTable from "./ProductTable.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx";
import SiteSettings from "./SiteSettings.jsx";
import UserDetail from "./UserDetail.jsx";
import Users from "./Users.jsx";
import "./admin.css";

// Shown instead of a blank screen when a page throws while rendering or loading.
function RouteError() {
  const error = useRouteError();

  return (
    <section className="admin-panel">
      <p className="admin-alert admin-alert-error" role="alert">
        Something went wrong while loading this page.
        {error?.message ? ` ${error.message}` : ""}
      </p>
      <Link className="admin-secondary-button" style={{ marginTop: "20px" }} to="/">
        Back to dashboard
      </Link>
    </section>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AdminLogin />,
    errorElement: <RouteError />,
  },
  {
    path: "/",
    element: <ProtectedAdminRoute />,
    errorElement: <RouteError />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <ProductTable />,
          },
          {
            path: "products/new",
            element: <AddProduct />,
          },
          {
            path: "products/:productId/edit",
            element: <EditProduct />,
          },
          {
            path: "collections",
            element: <CollectionsAdmin />,
          },
          {
            path: "collections/new",
            element: <CollectionForm />,
          },
          {
            path: "collections/:collectionId/edit",
            element: <CollectionForm />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/:orderId",
            element: <OrderDetail />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "users/:userId",
            element: <UserDetail />,
          },
          {
            path: "settings",
            element: <SiteSettings />,
          },
          {
            path: "profile",
            element: <AdminProfile />,
          },
        ],
      },
    ],
  },
  {
    // Unknown URLs (including old /admin/... links) go to the dashboard.
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
