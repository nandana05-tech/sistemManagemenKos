import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';

/**
 * Role-based route wrapper
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string[]} props.allowedRoles - Allowed roles to access
 * @param {string} props.redirectTo - Redirect path if not authorized
 */
const RoleRoute = ({ children, allowedRoles = [], redirectTo = '/dashboard' }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default RoleRoute;
