import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import { paymentService } from '../../services/payment.service';
import { formatRupiah, formatDate } from '../../utils/helpers';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiCreditCard,
    HiCheck,
    HiClock,
    HiX,
    HiExclamation,
    HiRefresh,
    HiUser,
    HiCalendar,
    HiCurrencyDollar,
    HiTag,
    HiDocumentText
} from 'react-icons/hi';

const PaymentDetail = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const isPemilik = user?.role === 'PEMILIK';

    const [payment, setPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const fetchPayment = async () => {
        setIsLoading(true);
        try {
            const response = await paymentService.getById(id);
            setPayment(response.data);
        } catch (error) {
            toast.error(error.message || 'Gagal memuat data pembayaran');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPayment();
        }
    }, [id]);

    const handleCheckStatus = async () => {
        setIsChecking(true);
        try {
            const response = await paymentService.checkStatus(id);
            toast.success(`Status: ${response.data?.status || 'Unknown'}`);
            fetchPayment();
        } catch (error) {
            toast.error(error.message || 'Gagal cek status');
        } finally {
            setIsChecking(false);
        }
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            await paymentService.verify(id);
            toast.success('Pembayaran berhasil diverifikasi');
            fetchPayment();
        } catch (error) {
            toast.error(error.message || 'Gagal verifikasi');
        } finally {
            setIsVerifying(false);
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
            case 'SUCCESS': return <HiCheck className="w-5 h-5" />;
            case 'PENDING': return <HiClock className="w-5 h-5" />;
            case 'FAILED': return <HiX className="w-5 h-5" />;
            case 'EXPIRED': return <HiExclamation className="w-5 h-5" />;
            default: return <HiClock className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS': return 'green';
            case 'PENDING': return 'yellow';
            case 'FAILED':
            case 'EXPIRED':
            case 'CANCEL': return 'red';
            default: return 'gray';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="card">
                <div className="card-body text-center py-12">
                    <HiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Pembayaran tidak ditemukan</h3>
                    <Link to="/payment" className="btn-primary">
                        Kembali ke Daftar Pembayaran
                    </Link>
                </div>
            </div>
        );
    }

    const statusColor = getStatusColor(payment.status);

    return (
        <div>
            {/* Back Button */}
            <Link to="/payment" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Riwayat Pembayaran
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Payment Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Info */}
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Detail Pembayaran</h3>
                            <span className={`badge inline-flex items-center gap-1 ${getStatusBadgeClass(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Kode Pembayaran</p>
                                    <p className="font-semibold text-gray-900">{payment.kodePembayaran}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                                    <p className="font-medium text-gray-900">
                                        {payment.transactionId || (payment.verifiedBy ? 'Verifikasi Manual' : '-')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Payment Gateway</p>
                                    <p className="text-gray-900 capitalize">
                                        {payment.paymentGateway || (payment.verifiedBy ? 'Manual' : (payment.transactionId ? 'Midtrans' : '-'))}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Metode Pembayaran</p>
                                    <p className="text-gray-900 capitalize">
                                        {payment.paymentMethod || (payment.verifiedBy ? 'Verifikasi Manual' : '-')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tanggal Transaksi</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <HiCalendar className="w-5 h-5 text-gray-400" />
                                        {formatDate(payment.paidAt || payment.createdAt)}
                                    </div>
                                </div>
                                {payment.verifiedAt && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Diverifikasi Pada</p>
                                        <p className="text-gray-900">{formatDate(payment.verifiedAt)}</p>
                                    </div>
                                )}
                                {payment.settlementTime && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tanggal Settlement</p>
                                        <p className="text-gray-900">{formatDate(payment.settlementTime)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tagihan Info */}
                    {payment.tagihan && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Informasi Tagihan</h3>
                            </div>
                            <div className="card-body">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <HiDocumentText className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nomor Tagihan</p>
                                            <p className="font-semibold text-gray-900">{payment.tagihan.nomorTagihan}</p>
                                            <p className="text-sm text-gray-500">{payment.tagihan.jenisTagihan?.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    {payment.tagihan.riwayatSewa?.kamar && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <HiTag className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Kamar</p>
                                                <p className="font-semibold text-gray-900">
                                                    {payment.tagihan.riwayatSewa.kamar.namaKamar}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Link
                                        to={`/tagihan/${payment.tagihan.id}`}
                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                    >
                                        Lihat Detail Tagihan →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Info (Pemilik only) */}
                    {isPemilik && payment.user && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Informasi Pengguna</h3>
                            </div>
                            <div className="card-body">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                        <HiUser className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{payment.user.name}</p>
                                        <p className="text-sm text-gray-500">{payment.user.email}</p>
                                        {payment.user.noTelepon && (
                                            <p className="text-sm text-gray-500">{payment.user.noTelepon}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Summary & Actions */}
                <div className="space-y-6">
                    {/* Amount Summary */}
                    <div className="card">
                        <div className="card-body">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-1">Jumlah Pembayaran</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatRupiah(payment.grossAmount)}
                                </p>
                            </div>

                            {/* Status Banner */}
                            <div className={`p-4 rounded-lg mb-6 bg-${statusColor}-50 border border-${statusColor}-200`}>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(payment.status)}
                                    <div>
                                        <p className={`font-medium text-${statusColor}-800`}>
                                            {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                                        </p>
                                        <p className={`text-sm text-${statusColor}-600`}>
                                            {payment.status === 'SUCCESS'
                                                ? 'Pembayaran berhasil diproses'
                                                : payment.status === 'PENDING'
                                                    ? 'Menunggu pembayaran'
                                                    : payment.status === 'EXPIRED'
                                                        ? 'Pembayaran sudah kadaluarsa'
                                                        : 'Pembayaran gagal'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {payment.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={handleCheckStatus}
                                            disabled={isChecking}
                                            className="btn-outline w-full inline-flex items-center justify-center gap-2"
                                        >
                                            {isChecking ? (
                                                <span className="spinner"></span>
                                            ) : (
                                                <>
                                                    <HiRefresh className="w-5 h-5" />
                                                    Cek Status Pembayaran
                                                </>
                                            )}
                                        </button>

                                        {isPemilik && (
                                            <button
                                                onClick={handleVerify}
                                                disabled={isVerifying}
                                                className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                            >
                                                {isVerifying ? (
                                                    <span className="spinner"></span>
                                                ) : (
                                                    <>
                                                        <HiCheck className="w-5 h-5" />
                                                        Verifikasi Manual
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {payment.snapRedirectUrl && (
                                            <a
                                                href={payment.snapRedirectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                            >
                                                <HiCreditCard className="w-5 h-5" />
                                                Lanjutkan Pembayaran
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    {payment.transactionId && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Info Transaksi</h3>
                            </div>
                            <div className="card-body space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Transaction ID</p>
                                    <p className="text-sm font-mono text-gray-900 break-all">{payment.transactionId}</p>
                                </div>
                                {payment.vaNumber && (
                                    <div>
                                        <p className="text-sm text-gray-500">VA Number</p>
                                        <p className="font-mono text-gray-900">{payment.vaNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetail;
