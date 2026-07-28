import { createBrowserRouter } from 'react-router-dom';
import AddProduct from '../admin/AddProduct.jsx';
import AdminLayout from '../admin/AdminLayout.jsx';
import AdminLogin from '../admin/AdminLogin.jsx';
import AdminProfile from '../admin/AdminProfile.jsx';
import Dashboard from '../admin/Dashboard.jsx';
import EditProduct from '../admin/EditProduct.jsx';
import ProductTable from '../admin/ProductTable.jsx';
import ProtectedAdminRoute from '../admin/ProtectedAdminRoute.jsx';
import UserDetail from '../admin/UserDetail.jsx';
import Users from '../admin/Users.jsx';
import RequireCustomerAuth from '../components/auth/RequireCustomerAuth.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import About from '../pages/About.jsx';
import Cart from '../pages/Cart.jsx';
import Collections from '../pages/Collections.jsx';
import Contact from '../pages/Contact.jsx';
import FAQ from '../pages/FAQ.jsx';
import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';
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
            path: 'users',
            element: <Users />,
          },
          {
            path: 'users/:userId',
            element: <UserDetail />,
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