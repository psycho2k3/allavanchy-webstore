import AppContext from './AppContext.jsx';
import { CartProvider } from './CartContext.jsx';

function AppProvider({ children }) {
  return (
    <AppContext.Provider value={null}>
      <CartProvider>{children}</CartProvider>
    </AppContext.Provider>
  );
}

export default AppProvider;
