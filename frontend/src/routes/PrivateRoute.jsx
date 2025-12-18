import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';

/**
 * Private route wrapper - requires authentication
 */
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated || !token) {
        // Redirect to login with return URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
