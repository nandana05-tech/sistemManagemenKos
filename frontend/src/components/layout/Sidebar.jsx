import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import {
    HiHome,
    HiUsers,
    HiOfficeBuilding,
    HiCube,
    HiCash,
    HiCreditCard,
    HiDocumentText,
    HiX,
} from 'react-icons/hi';

/**
 * Sidebar navigation component
 */
const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuthStore();
    const isPemilik = user?.role === 'PEMILIK';

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HiHome },
        { name: 'Kamar', href: '/kamar', icon: HiOfficeBuilding },
        ...(isPemilik ? [{ name: 'Penghuni', href: '/users', icon: HiUsers }] : []),
        { name: 'Inventaris', href: '/barang', icon: HiCube },
        { name: 'Tagihan', href: '/tagihan', icon: HiCash },
        { name: 'Pembayaran', href: '/payment', icon: HiCreditCard },
        { name: 'Laporan', href: '/laporan', icon: HiDocumentText },
    ];

    const isActive = (href) => location.pathname.startsWith(href);

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="font-bold text-gray-900">Kost Management</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`sidebar-link ${active ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User role badge */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Login sebagai</p>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <span className={`badge ${isPemilik ? 'badge-primary' : 'badge-success'} mt-1`}>
                            {isPemilik ? 'Pemilik' : 'Penghuni'}
                        </span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
