import { createBrowserRouter } from 'react-router-dom';
import AddProduct from '../admin/AddProduct.jsx';
import AdminLayout from '../admin/AdminLayout.jsx';
import AdminLogin from '../admin/AdminLogin.jsx';
import EditProduct from '../admin/EditProduct.jsx';
import ProductTable from '../admin/ProductTable.jsx';
import ProtectedAdminRoute from '../admin/ProtectedAdminRoute.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import About from '../pages/About.jsx';
import Cart from '../pages/Cart.jsx';
import Collections from '../pages/Collections.jsx';
import Contact from '../pages/Contact.jsx';
import FAQ from '../pages/FAQ.jsx';
import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import Shop from '../pages/Shop.jsx';

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
            element: <ProductTable />,
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
