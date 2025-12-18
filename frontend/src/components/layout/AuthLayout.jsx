import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';

/**
 * Layout for authentication pages (login, register, etc.)
 */
const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Kost Management
                    </h1>
                    <p className="text-primary-200">
                        Sistem Manajemen Kost Terpadu
                    </p>
                </div>

                {/* Auth form container */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <Outlet />
                </div>

                {/* Footer */}
                <p className="text-center text-primary-200 text-sm mt-6">
                    © {new Date().getFullYear()} Kost Management. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
