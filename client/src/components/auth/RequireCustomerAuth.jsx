import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

function RequireCustomerAuth({ children }) {
  const { isAuthenticated, requireAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const destination = location.pathname;
      requireAuth(() => navigate(destination, { replace: true }));
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default RequireCustomerAuth;