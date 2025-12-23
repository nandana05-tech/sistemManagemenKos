import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import { paymentService } from '../../services/payment.service';
import { formatRupiah, formatDate } from '../../utils/helpers';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
    HiCreditCard,
    HiSearch,
    HiFilter,
    HiCheck,
    HiClock,
    HiX,
    HiExclamation,
    HiExclamationCircle,
    HiChevronLeft,
    HiChevronRight,
    HiEye,
    HiRefresh
} from 'react-icons/hi';

const PaymentList = () => {
    const { user } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const isPemilik = user?.role === 'PEMILIK';

    const [payments, setPayments] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState({ total: 0, success: 0, pending: 0, failed: 0 });
    const [filters, setFilters] = useState({
        status: '',
        page: 1,
        limit: 10
    });
    const [checkingId, setCheckingId] = useState(null);
    const [cancelModal, setCancelModal] = useState({ isOpen: false, paymentId: null, isLoading: false });

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                ...(filters.status && { status: filters.status })
            };
            const response = await paymentService.getAll(params);
            setPayments(response.data || []);
            setMeta(response.meta);
        } catch (error) {
            toast.error(error.message || 'Gagal memuat data pembayaran');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await paymentService.getSummary();
            setSummary(response.data || { total: 0, success: 0, pending: 0, failed: 0 });
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

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
            };

            syncPayment();
        }
    }, [searchParams]);

    useEffect(() => {
        fetchPayments();
        fetchSummary();
    }, [filters, searchParams]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleCheckStatus = async (paymentId) => {
        setCheckingId(paymentId);
        try {
            const response = await paymentService.checkStatus(paymentId);
            toast.success(`Status: ${response.data?.status || 'Unknown'}`);
            fetchPayments(); // Refresh list
        } catch (error) {
            toast.error(error.message || 'Gagal cek status');
        } finally {
            setCheckingId(null);
        }
    };

    const handleVerifyPayment = async (paymentId) => {
        try {
            await paymentService.verify(paymentId);
            toast.success('Pembayaran berhasil diverifikasi');
            fetchPayments();
        } catch (error) {
            toast.error(error.message || 'Gagal verifikasi pembayaran');
        }
    };

    const openCancelModal = (paymentId) => {
        setCancelModal({ isOpen: true, paymentId, isLoading: false });
    };

    const closeCancelModal = () => {
        setCancelModal({ isOpen: false, paymentId: null, isLoading: false });
    };

    const handleCancelPayment = async () => {
        setCancelModal(prev => ({ ...prev, isLoading: true }));
        try {
            await paymentService.cancel(cancelModal.paymentId);
            toast.success('Pembayaran berhasil dibatalkan');
            closeCancelModal();
            fetchPayments();
            fetchSummary();
        } catch (error) {
            toast.error(error.message || 'Gagal membatalkan pembayaran');
            setCancelModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const getStatusBadgeClass = (status) => {
        const colorMap = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger',
            info: 'badge-info'
        };
        return colorMap[PAYMENT_STATUS_COLORS[status]] || 'badge-primary';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SUCCESS': return <HiCheck className="w-4 h-4" />;
            case 'PENDING': return <HiClock className="w-4 h-4" />;
            case 'FAILED': return <HiX className="w-4 h-4" />;
            case 'EXPIRED': return <HiExclamation className="w-4 h-4" />;
            default: return <HiClock className="w-4 h-4" />;
        }
    };


    return (
        <div>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">Riwayat Pembayaran</h1>
                <p className="page-description">
                    {isPemilik ? 'Lihat semua transaksi pembayaran' : 'Lihat riwayat pembayaran Anda'}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <HiCreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Transaksi</p>
                                <p className="text-xl font-bold text-gray-900">{meta?.total || summary.total}</p>
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
                                <p className="text-sm text-gray-500">Berhasil</p>
                                <p className="text-xl font-bold text-green-600">{summary.success}</p>
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
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-xl font-bold text-yellow-600">{summary.pending}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <HiX className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gagal/Expired</p>
                                <p className="text-xl font-bold text-red-600">{summary.failed}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                <option value="SUCCESS">Berhasil</option>
                                <option value="PENDING">Pending</option>
                                <option value="FAILED">Gagal</option>
                                <option value="EXPIRED">Expired</option>
                                <option value="CANCEL">Dibatalkan</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({ status: '', page: 1, limit: 10 })}
                            className="btn-outline"
                        >
                            Reset
                        </button>
                        <button
                            onClick={fetchPayments}
                            className="btn-outline inline-flex items-center gap-2"
                        >
                            <HiRefresh className="w-5 h-5" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                </div>
            ) : payments.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-12">
                        <HiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pembayaran</h3>
                        <p className="text-gray-500">
                            {filters.status ? 'Tidak ada pembayaran dengan status ini' : 'Riwayat pembayaran akan muncul di sini'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kode Pembayaran</th>
                                    {isPemilik && (
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pengguna</th>
                                    )}
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tagihan</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Metode</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Jumlah</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{payment.kodePembayaran}</p>
                                            <p className="text-xs text-gray-500">{payment.orderId}</p>
                                        </td>
                                        {isPemilik && (
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900">{payment.user?.name}</p>
                                                <p className="text-sm text-gray-500">{payment.user?.email}</p>
                                            </td>
                                        )}
                                        <td className="px-4 py-3 text-gray-600">
                                            {payment.tagihan?.nomorTagihan || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <span className="capitalize">{payment.paymentMethod || payment.paymentGateway || '-'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                            {formatRupiah(payment.grossAmount)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {formatDate(payment.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge inline-flex items-center gap-1 ${getStatusBadgeClass(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/payment/${payment.id}`}
                                                    className="btn-outline btn-sm inline-flex items-center gap-1"
                                                >
                                                    <HiEye className="w-4 h-4" />
                                                    Detail
                                                </Link>

                                                {payment.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCheckStatus(payment.id)}
                                                        disabled={checkingId === payment.id}
                                                        className="btn-outline btn-sm inline-flex items-center gap-1"
                                                    >
                                                        {checkingId === payment.id ? (
                                                            <span className="spinner w-4 h-4"></span>
                                                        ) : (
                                                            <>
                                                                <HiRefresh className="w-4 h-4" />
                                                                Cek
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {isPemilik && payment.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleVerifyPayment(payment.id)}
                                                        className="btn-primary btn-sm inline-flex items-center gap-1"
                                                    >
                                                        <HiCheck className="w-4 h-4" />
                                                        Verifikasi
                                                    </button>
                                                )}

                                                {/* Cancel button for PENDING payments */}
                                                {payment.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => openCancelModal(payment.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded text-sm inline-flex items-center gap-1"
                                                        title="Batalkan pembayaran"
                                                    >
                                                        <HiX className="w-4 h-4" />
                                                        Batal
                                                    </button>
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
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} pembayaran
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

            {/* Cancel Confirmation Modal */}
            {cancelModal.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                            onClick={closeCancelModal}
                        ></div>

                        {/* Modal */}
                        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                                <HiExclamationCircle className="w-6 h-6 text-red-600" />
                            </div>

                            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                                Batalkan Pembayaran?
                            </h3>

                            <p className="text-sm text-center text-gray-500 mb-6">
                                Apakah Anda yakin ingin membatalkan pembayaran ini? Tagihan dan data sewa terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeCancelModal}
                                    disabled={cancelModal.isLoading}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                                >
                                    Tidak, Kembali
                                </button>
                                <button
                                    onClick={handleCancelPayment}
                                    disabled={cancelModal.isLoading}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                                >
                                    {cancelModal.isLoading ? (
                                        <>
                                            <span className="spinner w-4 h-4 border-white"></span>
                                            Memproses...
                                        </>
                                    ) : (
                                        'Ya, Batalkan'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentList;
