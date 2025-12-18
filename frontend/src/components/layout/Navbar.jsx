import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import { HiMenu, HiBell, HiUser, HiLogout, HiCog } from 'react-icons/hi';
import { getInitials, stringToColor } from '../../utils/helpers';

/**
 * Top navbar component
 */
const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Left side - menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <HiMenu className="w-6 h-6" />
                </button>

                {/* Right side - notifications and profile */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                        <HiBell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {user?.fotoProfil ? (
                                <img
                                    src={user.fotoProfil}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                                    style={{ backgroundColor: stringToColor(user?.name) }}
                                >
                                    {getInitials(user?.name)}
                                </div>
                            )}
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                {user?.name}
                            </span>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <HiUser className="w-4 h-4" />
                                        Profil Saya
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <HiCog className="w-4 h-4" />
                                        Pengaturan
                                    </Link>
                                    <hr className="my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <HiLogout className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
