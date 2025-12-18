import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLaporanStore } from '../../features/laporan/laporanStore';
import { useAuthStore } from '../../features/auth/authStore';
import { formatDate } from '../../utils/helpers';
import {
    LAPORAN_STATUS_LABELS,
    LAPORAN_STATUS_COLORS,
    PRIORITAS_LABELS,
    PRIORITAS_COLORS
} from '../../utils/constants';
import toast from 'react-hot-toast';
import {
    HiPlus,
    HiFilter,
    HiExclamation,
    HiClock,
    HiCheck,
    HiX,
    HiChevronLeft,
    HiChevronRight,
    HiEye,
    HiPencil,
    HiTrash,
    HiDotsVertical,
    HiClipboardList,
    HiOfficeBuilding
} from 'react-icons/hi';

const LaporanList = () => {
    const { user } = useAuthStore();
    const {
        laporan,
        summary,
        meta,
        isLoading,
        fetchLaporan,
        fetchSummary,
        deleteLaporan,
        updateStatus
    } = useLaporanStore();

    const isPemilik = user?.role === 'PEMILIK';

    const [filters, setFilters] = useState({
        status: '',
        prioritas: '',
        page: 1,
        limit: 10
    });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, laporan: null });
    const [statusModal, setStatusModal] = useState({ show: false, laporan: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        if (isPemilik) {
            fetchSummary();
        }
    }, [isPemilik]);

    useEffect(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.status && { status: filters.status }),
            ...(filters.prioritas && { prioritas: filters.prioritas })
        };
        fetchLaporan(params);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleDelete = async () => {
        if (!deleteModal.laporan) return;
        setIsDeleting(true);
        try {
            await deleteLaporan(deleteModal.laporan.id);
            toast.success('Laporan berhasil dihapus');
            setDeleteModal({ show: false, laporan: null });
            if (isPemilik) fetchSummary();
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus laporan');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!statusModal.laporan || !newStatus) return;
        try {
            await updateStatus(statusModal.laporan.id, newStatus, newStatus === 'SELESAI' ? new Date().toISOString() : null);
            toast.success('Status laporan berhasil diubah');
            setStatusModal({ show: false, laporan: null });
            setNewStatus('');
            if (isPemilik) fetchSummary();
        } catch (error) {
            toast.error(error.message || 'Gagal mengubah status');
        }
    };

    const getStatusBadgeClass = (status) => {
        const colorMap = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger',
            info: 'badge-info'
        };
        return colorMap[LAPORAN_STATUS_COLORS[status]] || 'badge-primary';
    };

    const getPriorityBadgeClass = (priority) => {
        const colorMap = {
            primary: 'badge-primary',
            info: 'badge-info',
            warning: 'badge-warning',
            danger: 'badge-danger'
        };
        return colorMap[PRIORITAS_COLORS[priority]] || 'badge-primary';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SELESAI': return <HiCheck className="w-4 h-4" />;
            case 'DIPROSES': return <HiClock className="w-4 h-4" />;
            case 'DITOLAK': return <HiX className="w-4 h-4" />;
            default: return <HiExclamation className="w-4 h-4" />;
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Laporan Kerusakan</h1>
                    <p className="page-description">
                        {isPemilik ? 'Kelola laporan kerusakan dari penghuni' : 'Laporkan kerusakan di kamar Anda'}
                    </p>
                </div>
                {!isPemilik && (
                    <Link to="/laporan/new" className="btn-primary inline-flex items-center gap-2">
                        <HiPlus className="w-5 h-5" />
                        Buat Laporan
                    </Link>
                )}
            </div>

            {/* Summary Cards (Pemilik only) */}
            {isPemilik && summary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <HiClipboardList className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Laporan</p>
                                    <p className="text-xl font-bold text-gray-900">{summary.total || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <HiExclamation className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Diajukan</p>
                                    <p className="text-xl font-bold text-yellow-600">{summary.diajukan || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <HiClock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Diproses</p>
                                    <p className="text-xl font-bold text-orange-600">{summary.diproses || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <HiCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Selesai</p>
                                    <p className="text-xl font-bold text-green-600">{summary.selesai || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <select
                                className="input"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="DIAJUKAN">Diajukan</option>
                                <option value="DIPROSES">Diproses</option>
                                <option value="SELESAI">Selesai</option>
                                <option value="DITOLAK">Ditolak</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className="input"
                                value={filters.prioritas}
                                onChange={(e) => handleFilterChange('prioritas', e.target.value)}
                            >
                                <option value="">Semua Prioritas</option>
                                <option value="RENDAH">Rendah</option>
                                <option value="NORMAL">Normal</option>
                                <option value="TINGGI">Tinggi</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({ status: '', prioritas: '', page: 1, limit: 10 })}
                            className="btn-outline"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Laporan List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                </div>
            ) : laporan.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-12">
                        <HiClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan</h3>
                        <p className="text-gray-500 mb-4">
                            {filters.status || filters.prioritas
                                ? 'Tidak ada laporan dengan filter ini'
                                : 'Belum ada laporan kerusakan'}
                        </p>
                        {!isPemilik && (
                            <Link to="/laporan/new" className="btn-primary inline-flex items-center gap-2">
                                <HiPlus className="w-5 h-5" />
                                Buat Laporan Pertama
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {laporan.map((item) => (
                        <div key={item.id} className="card">
                            <div className="card-body">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Left - Main Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.prioritas === 'URGENT' ? 'bg-red-100' :
                                                    item.prioritas === 'TINGGI' ? 'bg-orange-100' :
                                                        item.prioritas === 'NORMAL' ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                <HiExclamation className={`w-6 h-6 ${item.prioritas === 'URGENT' ? 'text-red-600' :
                                                        item.prioritas === 'TINGGI' ? 'text-orange-600' :
                                                            item.prioritas === 'NORMAL' ? 'text-blue-600' : 'text-gray-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="font-semibold text-gray-900">{item.judul}</h3>
                                                    <span className={`badge ${getPriorityBadgeClass(item.prioritas)}`}>
                                                        {PRIORITAS_LABELS[item.prioritas]}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                                    {item.isiLaporan || 'Tidak ada deskripsi'}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    {isPemilik && item.user && (
                                                        <span>{item.user.name}</span>
                                                    )}
                                                    {item.kamar && (
                                                        <span className="flex items-center gap-1">
                                                            <HiOfficeBuilding className="w-4 h-4" />
                                                            {item.kamar.namaKamar}
                                                        </span>
                                                    )}
                                                    <span>{formatDate(item.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right - Status & Actions */}
                                    <div className="flex items-center gap-3">
                                        <span className={`badge inline-flex items-center gap-1 ${getStatusBadgeClass(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {LAPORAN_STATUS_LABELS[item.status]}
                                        </span>

                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <HiDotsVertical className="w-5 h-5 text-gray-500" />
                                            </button>

                                            {activeDropdown === item.id && (
                                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                                                    <Link
                                                        to={`/laporan/${item.id}`}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setActiveDropdown(null)}
                                                    >
                                                        <HiEye className="w-4 h-4" />
                                                        Detail
                                                    </Link>

                                                    {/* Edit for own report or Pemilik */}
                                                    {(item.userId === user?.id || isPemilik) && item.status === 'DIAJUKAN' && (
                                                        <Link
                                                            to={`/laporan/${item.id}/edit`}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setActiveDropdown(null)}
                                                        >
                                                            <HiPencil className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                    )}

                                                    {/* Update Status (Pemilik only) */}
                                                    {isPemilik && item.status !== 'SELESAI' && (
                                                        <button
                                                            onClick={() => {
                                                                setStatusModal({ show: true, laporan: item });
                                                                setNewStatus(item.status);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <HiClock className="w-4 h-4" />
                                                            Ubah Status
                                                        </button>
                                                    )}

                                                    <hr className="my-1" />
                                                    <button
                                                        onClick={() => {
                                                            setDeleteModal({ show: true, laporan: item });
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} laporan
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                            className="btn-outline p-2 disabled:opacity-50"
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(Math.min(meta.totalPages, 5))].map((_, i) => {
                            const page = i + 1;
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
                        })}

                        <button
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page === meta.totalPages}
                            className="btn-outline p-2 disabled:opacity-50"
                        >
                            <HiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Laporan?</h3>
                            <p className="text-gray-500 mb-6">
                                Laporan "<strong>{deleteModal.laporan?.judul}</strong>" akan dihapus.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, laporan: null })}
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

            {/* Status Update Modal */}
            {statusModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubah Status Laporan</h3>
                        <p className="text-gray-500 mb-4">{statusModal.laporan?.judul}</p>
                        <div className="mb-6">
                            <label className="label">Status Baru</label>
                            <select
                                className="input"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="DIAJUKAN">Diajukan</option>
                                <option value="DIPROSES">Diproses</option>
                                <option value="SELESAI">Selesai</option>
                                <option value="DITOLAK">Ditolak</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setStatusModal({ show: false, laporan: null });
                                    setNewStatus('');
                                }}
                                className="btn-outline flex-1"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="btn-primary flex-1"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)} />
            )}
        </div>
    );
};

export default LaporanList;
