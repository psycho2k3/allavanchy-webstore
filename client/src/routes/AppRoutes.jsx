import { createBrowserRouter } from 'react-router-dom';
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