import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTagihanStore } from '../../features/tagihan/tagihanStore';
import { useAuthStore } from '../../features/auth/authStore';
import { formatRupiah, formatDate } from '../../utils/helpers';
import { TAGIHAN_STATUS_LABELS, TAGIHAN_STATUS_COLORS } from '../../utils/constants';
import { paymentService } from '../../services/payment.service';
import toast from 'react-hot-toast';
import {
    HiPlus,
    HiSearch,
    HiFilter,
    HiRefresh,
    HiCurrencyDollar,
    HiCreditCard,
    HiCalendar,
    HiExclamation,
    HiCheck,
    HiClock,
    HiChevronLeft,
    HiChevronRight,
    HiEye,
    HiPencil,
    HiTrash,
    HiDotsVertical
} from 'react-icons/hi';

const TagihanList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuthStore();
    const {
        tagihan,
        summary,
        meta,
        isLoading,
        fetchTagihan,
        fetchSummary,
        generateMonthly,
        deleteTagihan
    } = useTagihanStore();

    const isPemilik = user?.role === 'PEMILIK';

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        page: 1,
        limit: 10
    });
    const [showFilters, setShowFilters] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, tagihan: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [payingId, setPayingId] = useState(null);

    // Check for payment return from Midtrans
    useEffect(() => {
        const orderId = searchParams.get('order_id');
        const transactionStatus = searchParams.get('transaction_status');
        const statusCode = searchParams.get('status_code');

        if (orderId) {
            // Returned from Midtrans with order_id, sync status from Midtrans API
            const syncPayment = async () => {
                try {
                    const response = await paymentService.syncStatus(orderId);
                    if (response.data?.midtransStatus === 'settlement' || response.data?.midtransStatus === 'capture') {
                        toast.success('Pembayaran berhasil! Status telah diupdate.');
                    } else if (response.data?.midtransStatus === 'pending') {
                        toast.info('Pembayaran dalam proses. Silakan selesaikan pembayaran.');
                    } else if (['deny', 'cancel', 'expire'].includes(response.data?.midtransStatus)) {
                        toast.error('Pembayaran gagal atau dibatalkan.');
                    } else {
                        toast.success(response.message || 'Status pembayaran diperbarui');
                    }
                } catch (error) {
                    console.error('Error syncing payment:', error);
                    // Fallback to URL params
                    if (transactionStatus === 'settlement' || statusCode === '200') {
                        toast.success('Pembayaran berhasil!');
                    } else if (transactionStatus === 'pending') {
                        toast.info('Menunggu pembayaran...');
                    }
                }

                // Clear URL params and refresh data
                setSearchParams({});
                fetchSummary();
                fetchTagihan({ page: 1, limit: 10 });
            };

            syncPayment();
        }
    }, [searchParams]);

    useEffect(() => {
        fetchSummary();
    }, []);

    useEffect(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.status && { status: filters.status })
        };
        fetchTagihan(params);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleGenerateMonthly = async () => {
        setIsGenerating(true);
        try {
            const response = await generateMonthly();
            toast.success(response.message || 'Tagihan bulanan berhasil di-generate');
            fetchSummary();
        } catch (error) {
            toast.error(error.message || 'Gagal generate tagihan');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.tagihan) return;
        setIsDeleting(true);
        try {
            await deleteTagihan(deleteModal.tagihan.id);
            toast.success('Tagihan berhasil dihapus');
            setDeleteModal({ show: false, tagihan: null });
            fetchSummary();
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus tagihan');
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePayNow = async (tagihanItem) => {
        setPayingId(tagihanItem.id);
        try {
            const response = await paymentService.create({
                tagihanId: tagihanItem.id
            });

            // Prefer redirect URL for simplicity
            if (response.data?.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            } else if (response.data?.snapRedirectUrl) {
                window.location.href = response.data.snapRedirectUrl;
            } else if (response.data?.snapToken && window.snap) {
                // Use Midtrans Snap popup if available
                window.snap.pay(response.data.snapToken, {
                    onSuccess: () => {
                        toast.success('Pembayaran berhasil!');
                        fetchTagihan(filters);
                        fetchSummary();
                    },
                    onPending: () => {
                        toast.info('Menunggu pembayaran...');
                    },
                    onError: () => {
                        toast.error('Pembayaran gagal');
                    },
                    onClose: () => {
                        toast.info('Pembayaran dibatalkan');
                    }
                });
            } else {
                toast.error('Tidak dapat memproses pembayaran. Coba lagi nanti.');
            }
        } catch (error) {
            toast.error(error.message || 'Gagal memproses pembayaran');
        } finally {
            setPayingId(null);
        }
    };

    const getStatusBadgeClass = (status) => {
        const colorMap = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger'
        };
        return colorMap[TAGIHAN_STATUS_COLORS[status]] || 'badge-primary';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'LUNAS': return <HiCheck className="w-4 h-4" />;
            case 'JATUH_TEMPO': return <HiExclamation className="w-4 h-4" />;
            default: return <HiClock className="w-4 h-4" />;
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Tagihan</h1>
                    <p className="page-description">
                        {isPemilik ? 'Kelola tagihan penghuni' : 'Lihat dan bayar tagihan Anda'}
                    </p>
                </div>
                {isPemilik && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateMonthly}
                            disabled={isGenerating}
                            className="btn-outline inline-flex items-center gap-2"
                        >
                            <HiRefresh className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                            Generate Bulanan
                        </button>
                        <Link to="/tagihan/new" className="btn-primary inline-flex items-center gap-2">
                            <HiPlus className="w-5 h-5" />
                            Buat Tagihan
                        </Link>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <HiCurrencyDollar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Tagihan</p>
                                    <p className="text-xl font-bold text-gray-900">{summary.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <HiClock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Belum Lunas</p>
                                    <p className="text-xl font-bold text-yellow-600">{summary.belumLunas}</p>
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
                                    <p className="text-sm text-gray-500">Lunas</p>
                                    <p className="text-xl font-bold text-green-600">{summary.lunas}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <HiExclamation className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Jatuh Tempo</p>
                                    <p className="text-xl font-bold text-red-600">{summary.jatuhTempo}</p>
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
                                <option value="BELUM_LUNAS">Belum Lunas</option>
                                <option value="LUNAS">Lunas</option>
                                <option value="JATUH_TEMPO">Jatuh Tempo</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({ search: '', status: '', page: 1, limit: 10 })}
                            className="btn-outline"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Tagihan Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                </div>
            ) : tagihan.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-12">
                        <HiCurrencyDollar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada tagihan</h3>
                        <p className="text-gray-500 mb-4">
                            {filters.status ? 'Tidak ada tagihan dengan status ini' : 'Belum ada tagihan yang dibuat'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">No. Tagihan</th>
                                    {isPemilik && (
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Penghuni</th>
                                    )}
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kamar</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jenis</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Nominal</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jatuh Tempo</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tagihan.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{item.nomorTagihan}</p>
                                        </td>
                                        {isPemilik && (
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900">{item.user?.name}</p>
                                                <p className="text-sm text-gray-500">{item.user?.email}</p>
                                            </td>
                                        )}
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.riwayatSewa?.kamar?.namaKamar || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.jenisTagihan?.replace('_', ' ') || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                            {formatRupiah(item.nominal)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <HiCalendar className="w-4 h-4" />
                                                {formatDate(item.tanggalJatuhTempo)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge inline-flex items-center gap-1 ${getStatusBadgeClass(item.status)}`}>
                                                {getStatusIcon(item.status)}
                                                {TAGIHAN_STATUS_LABELS[item.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Pay Now Button for Penghuni */}
                                                {!isPemilik && item.status === 'BELUM_LUNAS' && (
                                                    <button
                                                        onClick={() => handlePayNow(item)}
                                                        disabled={payingId === item.id}
                                                        className="btn-primary btn-sm inline-flex items-center gap-1"
                                                    >
                                                        {payingId === item.id ? (
                                                            <span className="spinner w-4 h-4"></span>
                                                        ) : (
                                                            <>
                                                                <HiCreditCard className="w-4 h-4" />
                                                                Bayar
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {/* Actions Dropdown for Pemilik */}
                                                {isPemilik && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                        >
                                                            <HiDotsVertical className="w-5 h-5 text-gray-500" />
                                                        </button>

                                                        {activeDropdown === item.id && (
                                                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                                                                <Link
                                                                    to={`/tagihan/${item.id}`}
                                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                >
                                                                    <HiEye className="w-4 h-4" />
                                                                    Detail
                                                                </Link>
                                                                {item.status !== 'LUNAS' && (
                                                                    <Link
                                                                        to={`/tagihan/${item.id}/edit`}
                                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        onClick={() => setActiveDropdown(null)}
                                                                    >
                                                                        <HiPencil className="w-4 h-4" />
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                <hr className="my-1" />
                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteModal({ show: true, tagihan: item });
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
                                                )}

                                                {/* Detail link for Penghuni */}
                                                {!isPemilik && (
                                                    <Link
                                                        to={`/tagihan/${item.id}`}
                                                        className="btn-outline btn-sm inline-flex items-center gap-1"
                                                    >
                                                        <HiEye className="w-4 h-4" />
                                                        Detail
                                                    </Link>
                                                )}
                                            </div>
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
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} tagihan
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Tagihan?</h3>
                            <p className="text-gray-500 mb-6">
                                Tagihan <strong>{deleteModal.tagihan?.nomorTagihan}</strong> akan dihapus.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, tagihan: null })}
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
                <div className="fixed inset-0 z-0" onClick={() => setActiveDropdown(null)} />
            )}
        </div>
    );
};

export default TagihanList;
