import { createBrowserRouter } from 'react-router-dom';
import AddProduct from '../admin/AddProduct.jsx';
import AdminLayout from '../admin/AdminLayout.jsx';
import AdminLogin from '../admin/AdminLogin.jsx';
import AdminProfile from '../admin/AdminProfile.jsx';
import CollectionForm from '../admin/CollectionForm.jsx';
import CollectionsAdmin from '../admin/CollectionsAdmin.jsx';
import Dashboard from '../admin/Dashboard.jsx';
import EditProduct from '../admin/EditProduct.jsx';
import OrderDetail from '../admin/OrderDetail.jsx';
import Orders from '../admin/Orders.jsx';
import ProductTable from '../admin/ProductTable.jsx';
import ProtectedAdminRoute from '../admin/ProtectedAdminRoute.jsx';
import SiteSettings from '../admin/SiteSettings.jsx';
import UserDetail from '../admin/UserDetail.jsx';
import Users from '../admin/Users.jsx';
import RequireCustomerAuth from '../components/auth/RequireCustomerAuth.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import About from '../pages/About.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Collections from '../pages/Collections.jsx';
import Contact from '../pages/Contact.jsx';
import FAQ from '../pages/FAQ.jsx';
import Home from '../pages/Home.jsx';
import MyOrders from '../pages/MyOrders.jsx';
import NotFound from '../pages/NotFound.jsx';
import OrderConfirmation from '../pages/OrderConfirmation.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import Profile from '../pages/Profile.jsx';
import Shop from '../pages/Shop.jsx';
import Wishlist from '../pages/Wishlist.jsx';

const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
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
            path: 'products',
            element: <ProductTable />,
          },
          {
            path: 'products/new',
            element: <AddProduct />,
          },
          {
            path: 'products/:productId/edit',
            element: <EditProduct />,
          },
          {
            path: 'collections',
            element: <CollectionsAdmin />,
          },
          {
            path: 'collections/new',
            element: <CollectionForm />,
          },
          {
            path: 'collections/:collectionId/edit',
            element: <CollectionForm />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'orders/:orderId',
            element: <OrderDetail />,
          },
          {
            path: 'users',
            element: <Users />,
          },
          {
            path: 'users/:userId',
            element: <UserDetail />,
          },
          {
            path: 'settings',
            element: <SiteSettings />,
          },
          {
            path: 'profile',
            element: <AdminProfile />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'collections',
        element: <Collections />,
      },
      {
        path: 'products/:productId',
        element: <ProductDetails />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: (
          <RequireCustomerAuth>
            <Checkout />
          </RequireCustomerAuth>
        ),
      },
      {
        path: 'order-confirmation',
        element: (
          <RequireCustomerAuth>
            <OrderConfirmation />
          </RequireCustomerAuth>
        ),
      },
      {
        path: 'orders',
        element: (
          <RequireCustomerAuth>
            <MyOrders />
          </RequireCustomerAuth>
        ),
      },
      {
        path: 'wishlist',
        element: <Wishlist />,
      },
      {
        path: 'profile',
        element: (
          <RequireCustomerAuth>
            <Profile />
          </RequireCustomerAuth>
        ),
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;