import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AdminLogin />,
  },
  {
    path: "/",
    element: <ProtectedAdminRoute />,
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
