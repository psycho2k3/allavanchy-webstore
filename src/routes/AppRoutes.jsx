import { createBrowserRouter } from 'react-router-dom';
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
