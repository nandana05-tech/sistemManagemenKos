import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTagihanStore } from '../../features/tagihan/tagihanStore';
import { useAuthStore } from '../../features/auth/authStore';
import { formatRupiah, formatDate } from '../../utils/helpers';
import { TAGIHAN_STATUS_LABELS, TAGIHAN_STATUS_COLORS } from '../../utils/constants';
import { paymentService } from '../../services/payment.service';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiCreditCard,
    HiCalendar,
    HiUser,
    HiOfficeBuilding,
    HiCurrencyDollar,
    HiCheck,
    HiClock,
    HiExclamation,
    HiPencil
} from 'react-icons/hi';

const TagihanDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        selectedTagihan: tagihan,
        isLoading,
        fetchTagihanById
    } = useTagihanStore();

    const isPemilik = user?.role === 'PEMILIK';

    useEffect(() => {
        if (id) {
            fetchTagihanById(id);
        }
    }, [id]);

    const handlePayNow = async () => {
        try {
            const response = await paymentService.create({
                tagihanId: parseInt(id)
            });

            if (response.data?.snapRedirectUrl) {
                window.location.href = response.data.snapRedirectUrl;
            } else if (response.data?.snapToken) {
                window.snap.pay(response.data.snapToken, {
                    onSuccess: () => {
                        toast.success('Pembayaran berhasil!');
                        fetchTagihanById(id);
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
            }
        } catch (error) {
            toast.error(error.message || 'Gagal memproses pembayaran');
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
            case 'LUNAS': return <HiCheck className="w-5 h-5" />;
            case 'JATUH_TEMPO': return <HiExclamation className="w-5 h-5" />;
            default: return <HiClock className="w-5 h-5" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    if (!tagihan) {
        return (
            <div className="card">
                <div className="card-body text-center py-12">
                    <HiCurrencyDollar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tagihan tidak ditemukan</h3>
                    <Link to="/tagihan" className="btn-primary">
                        Kembali ke Daftar Tagihan
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Back Button */}
            <Link to="/tagihan" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Tagihan
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tagihan Info */}
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Detail Tagihan</h3>
                            <span className={`badge inline-flex items-center gap-1 ${getStatusBadgeClass(tagihan.status)}`}>
                                {getStatusIcon(tagihan.status)}
                                {TAGIHAN_STATUS_LABELS[tagihan.status]}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nomor Tagihan</p>
                                    <p className="font-semibold text-gray-900">{tagihan.nomorTagihan}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Jenis Tagihan</p>
                                    <p className="font-medium text-gray-900">
                                        {tagihan.jenisTagihan?.replace('_', ' ') || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tanggal Jatuh Tempo</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <HiCalendar className="w-5 h-5 text-gray-400" />
                                        {formatDate(tagihan.tanggalJatuhTempo)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tanggal Dibuat</p>
                                    <p className="text-gray-900">{formatDate(tagihan.createdAt)}</p>
                                </div>
                            </div>

                            {tagihan.keterangan && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-1">Keterangan</p>
                                    <p className="text-gray-900">{tagihan.keterangan}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Penghuni & Kamar Info */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Informasi Penyewa</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <HiUser className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Penghuni</p>
                                        <p className="font-semibold text-gray-900">{tagihan.user?.name}</p>
                                        <p className="text-sm text-gray-500">{tagihan.user?.email}</p>
                                        {tagihan.user?.noTelepon && (
                                            <p className="text-sm text-gray-500">{tagihan.user.noTelepon}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <HiOfficeBuilding className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kamar</p>
                                        <p className="font-semibold text-gray-900">
                                            {tagihan.riwayatSewa?.kamar?.namaKamar}
                                        </p>
                                        {tagihan.riwayatSewa?.kamar?.nomorKamar && (
                                            <p className="text-sm text-gray-500">
                                                No. {tagihan.riwayatSewa.kamar.nomorKamar}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    {tagihan.payment?.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Riwayat Pembayaran</h3>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {tagihan.payment.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">{payment.kodePembayaran}</p>
                                                <p className="text-sm text-gray-500">
                                                    {payment.paymentMethod || payment.paymentGateway}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {formatRupiah(payment.grossAmount)}
                                                </p>
                                                <span className={`text-xs ${payment.status === 'SUCCESS' ? 'text-green-600' :
                                                        payment.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Summary & Actions */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="card">
                        <div className="card-body">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatRupiah(tagihan.nominal)}
                                </p>
                            </div>

                            {/* Status Banner */}
                            <div className={`p-4 rounded-lg mb-6 ${tagihan.status === 'LUNAS' ? 'bg-green-50 border border-green-200' :
                                    tagihan.status === 'JATUH_TEMPO' ? 'bg-red-50 border border-red-200' :
                                        'bg-yellow-50 border border-yellow-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(tagihan.status)}
                                    <div>
                                        <p className={`font-medium ${tagihan.status === 'LUNAS' ? 'text-green-800' :
                                                tagihan.status === 'JATUH_TEMPO' ? 'text-red-800' :
                                                    'text-yellow-800'
                                            }`}>
                                            {TAGIHAN_STATUS_LABELS[tagihan.status]}
                                        </p>
                                        <p className={`text-sm ${tagihan.status === 'LUNAS' ? 'text-green-600' :
                                                tagihan.status === 'JATUH_TEMPO' ? 'text-red-600' :
                                                    'text-yellow-600'
                                            }`}>
                                            {tagihan.status === 'LUNAS'
                                                ? 'Tagihan sudah dibayar'
                                                : tagihan.status === 'JATUH_TEMPO'
                                                    ? 'Sudah melewati jatuh tempo'
                                                    : `Jatuh tempo: ${formatDate(tagihan.tanggalJatuhTempo)}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {tagihan.status !== 'LUNAS' && (
                                <div className="space-y-3">
                                    {!isPemilik && (
                                        <button
                                            onClick={handlePayNow}
                                            className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                        >
                                            <HiCreditCard className="w-5 h-5" />
                                            Bayar Sekarang
                                        </button>
                                    )}

                                    {isPemilik && (
                                        <Link
                                            to={`/tagihan/${tagihan.id}/edit`}
                                            className="btn-outline w-full inline-flex items-center justify-center gap-2"
                                        >
                                            <HiPencil className="w-5 h-5" />
                                            Edit Tagihan
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagihanDetail;
