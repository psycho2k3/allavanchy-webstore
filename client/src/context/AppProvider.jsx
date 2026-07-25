import AppContext from './AppContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { WishlistProvider } from './WishlistContext.jsx';
import AuthModal from '../components/auth/AuthModal.jsx';

function AppProvider({ children }) {
  return (
    <AppContext.Provider value={null}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <AuthModal />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </AppContext.Provider>
  );
}

export default AppProvider;