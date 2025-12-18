import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../features/users/userStore';
import { formatDate, formatPhone, getInitials } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
    HiPlus,
    HiSearch,
    HiFilter,
    HiUser,
    HiMail,
    HiPhone,
    HiPencil,
    HiTrash,
    HiCheck,
    HiX,
    HiChevronLeft,
    HiChevronRight,
    HiDotsVertical
} from 'react-icons/hi';

const UserList = () => {
    const {
        users,
        meta,
        isLoading,
        fetchUsers,
        deleteUser,
        toggleUserStatus
    } = useUserStore();

    const [filters, setFilters] = useState({
        search: '',
        role: '',
        isActive: '',
        page: 1,
        limit: 10
    });
    const [showFilters, setShowFilters] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.search && { search: filters.search }),
            ...(filters.role && { role: filters.role }),
            ...(filters.isActive !== '' && { isActive: filters.isActive })
        };
        fetchUsers(params);
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            toast.success('Status pengguna berhasil diubah');
        } catch (error) {
            toast.error(error.message || 'Gagal mengubah status');
        }
        setActiveDropdown(null);
    };

    const handleDelete = async () => {
        if (!deleteModal.user) return;
        setIsDeleting(true);
        try {
            await deleteUser(deleteModal.user.id);
            toast.success('Pengguna berhasil dihapus');
            setDeleteModal({ show: false, user: null });
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus pengguna');
        } finally {
            setIsDeleting(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        return role === 'PEMILIK' ? 'badge-primary' : 'badge-info';
    };

    const getStatusBadgeClass = (isActive) => {
        return isActive ? 'badge-success' : 'badge-danger';
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Manajemen Pengguna</h1>
                    <p className="page-description">
                        {meta?.total || 0} pengguna terdaftar
                    </p>
                </div>
                <Link to="/users/new" className="btn-primary inline-flex items-center gap-2">
                    <HiPlus className="w-5 h-5" />
                    Tambah Pengguna
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    className="input pl-10 w-full"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                        </form>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-outline inline-flex items-center gap-2 ${showFilters ? 'bg-gray-100' : ''}`}
                        >
                            <HiFilter className="w-5 h-5" />
                            Filter
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="label">Role</label>
                                <select
                                    className="input"
                                    value={filters.role}
                                    onChange={(e) => handleFilterChange('role', e.target.value)}
                                >
                                    <option value="">Semua Role</option>
                                    <option value="PEMILIK">Pemilik</option>
                                    <option value="PENGHUNI">Penghuni</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Status</label>
                                <select
                                    className="input"
                                    value={filters.isActive}
                                    onChange={(e) => handleFilterChange('isActive', e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="true">Aktif</option>
                                    <option value="false">Nonaktif</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => setFilters({ search: '', role: '', isActive: '', page: 1, limit: 10 })}
                                    className="btn-outline w-full"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-12">
                        <HiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pengguna ditemukan</h3>
                        <p className="text-gray-500 mb-4">
                            {filters.search || filters.role || filters.isActive !== ''
                                ? 'Coba ubah filter pencarian Anda'
                                : 'Belum ada pengguna yang terdaftar'}
                        </p>
                        <Link to="/users/new" className="btn-primary inline-flex items-center gap-2">
                            <HiPlus className="w-5 h-5" />
                            Tambah Pengguna Pertama
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pengguna</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kontak</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Terdaftar</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {user.fotoProfil ? (
                                                    <img
                                                        src={user.fotoProfil}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
                                                        {getInitials(user.name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name || 'No Name'}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <HiMail className="w-4 h-4" />
                                                    {user.email}
                                                </div>
                                                {user.noTelepon && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <HiPhone className="w-4 h-4" />
                                                        {formatPhone(user.noTelepon)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role === 'PEMILIK' ? 'Pemilik' : 'Penghuni'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${getStatusBadgeClass(user.isActive)}`}>
                                                {user.isActive ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <HiDotsVertical className="w-5 h-5 text-gray-500" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {activeDropdown === user.id && (
                                                <div className="absolute right-4 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                                                    <Link
                                                        to={`/users/${user.id}/edit`}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setActiveDropdown(null)}
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {user.isActive ? (
                                                            <>
                                                                <HiX className="w-4 h-4" />
                                                                Nonaktifkan
                                                            </>
                                                        ) : (
                                                            <>
                                                                <HiCheck className="w-4 h-4" />
                                                                Aktifkan
                                                            </>
                                                        )}
                                                    </button>
                                                    <hr className="my-1" />
                                                    <button
                                                        onClick={() => {
                                                            setDeleteModal({ show: true, user });
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} pengguna
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                            className="btn-outline p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(meta.totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 ||
                                page === meta.totalPages ||
                                (page >= meta.page - 1 && page <= meta.page + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg font-medium ${page === meta.page
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                            if (page === meta.page - 2 || page === meta.page + 2) {
                                return <span key={page} className="px-2 text-gray-400">...</span>;
                            }
                            return null;
                        })}

                        <button
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page === meta.totalPages}
                            className="btn-outline p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Pengguna?</h3>
                            <p className="text-gray-500 mb-6">
                                Apakah Anda yakin ingin menghapus <strong>{deleteModal.user?.name}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, user: null })}
                                    className="btn-outline flex-1"
                                    disabled={isDeleting}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </div>
    );
};

export default UserList;
