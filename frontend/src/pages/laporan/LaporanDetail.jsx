import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    HiArrowLeft,
    HiPencil,
    HiExclamation,
    HiClock,
    HiCheck,
    HiX,
    HiUser,
    HiOfficeBuilding,
    HiCalendar,
    HiClipboardList
} from 'react-icons/hi';

const LaporanDetail = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const {
        selectedLaporan: laporan,
        isLoading,
        fetchLaporanById,
        updateStatus
    } = useLaporanStore();

    const isPemilik = user?.role === 'PEMILIK';

    useEffect(() => {
        if (id) {
            fetchLaporanById(id);
        }
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            await updateStatus(parseInt(id), newStatus, newStatus === 'SELESAI' ? new Date().toISOString() : null);
            toast.success('Status berhasil diubah');
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
            case 'SELESAI': return <HiCheck className="w-5 h-5" />;
            case 'DIPROSES': return <HiClock className="w-5 h-5" />;
            case 'DITOLAK': return <HiX className="w-5 h-5" />;
            default: return <HiExclamation className="w-5 h-5" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    if (!laporan) {
        return (
            <div className="card">
                <div className="card-body text-center py-12">
                    <HiClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Laporan tidak ditemukan</h3>
                    <Link to="/laporan" className="btn-primary">
                        Kembali ke Daftar Laporan
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Back Button */}
            <Link to="/laporan" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Laporan
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Laporan Info */}
                    <div className="card">
                        <div className="card-header flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 mb-2">{laporan.judul}</h1>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`badge ${getPriorityBadgeClass(laporan.prioritas)}`}>
                                        {PRIORITAS_LABELS[laporan.prioritas]}
                                    </span>
                                    <span className={`badge inline-flex items-center gap-1 ${getStatusBadgeClass(laporan.status)}`}>
                                        {getStatusIcon(laporan.status)}
                                        {LAPORAN_STATUS_LABELS[laporan.status]}
                                    </span>
                                </div>
                            </div>
                            {(laporan.userId === user?.id || isPemilik) && laporan.status === 'DIAJUKAN' && (
                                <Link
                                    to={`/laporan/${laporan.id}/edit`}
                                    className="btn-outline inline-flex items-center gap-2"
                                >
                                    <HiPencil className="w-5 h-5" />
                                    Edit
                                </Link>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="prose prose-gray max-w-none">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h4>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {laporan.isiLaporan || 'Tidak ada deskripsi'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Room & User Info */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Informasi</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kamar */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <HiOfficeBuilding className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kamar</p>
                                        <p className="font-semibold text-gray-900">
                                            {laporan.kamar?.namaKamar || '-'}
                                        </p>
                                        {laporan.kamar?.nomorKamar && (
                                            <p className="text-sm text-gray-500">No. {laporan.kamar.nomorKamar}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Pelapor */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <HiUser className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Dilaporkan oleh</p>
                                        <p className="font-semibold text-gray-900">{laporan.user?.name}</p>
                                        <p className="text-sm text-gray-500">{laporan.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Timeline</h3>
                        </div>
                        <div className="card-body">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <HiCalendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Laporan Dibuat</p>
                                        <p className="text-sm text-gray-500">{formatDate(laporan.createdAt)}</p>
                                    </div>
                                </div>

                                {laporan.status !== 'DIAJUKAN' && (
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${laporan.status === 'SELESAI' ? 'bg-green-100' :
                                                laporan.status === 'DITOLAK' ? 'bg-red-100' : 'bg-yellow-100'
                                            }`}>
                                            {getStatusIcon(laporan.status)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {laporan.status === 'DIPROSES' && 'Sedang Diproses'}
                                                {laporan.status === 'SELESAI' && 'Selesai'}
                                                {laporan.status === 'DITOLAK' && 'Ditolak'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {laporan.tanggalSelesai ? formatDate(laporan.tanggalSelesai) : formatDate(laporan.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Actions */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="card">
                        <div className="card-body">
                            <div className={`p-4 rounded-lg mb-4 ${laporan.status === 'SELESAI' ? 'bg-green-50 border border-green-200' :
                                    laporan.status === 'DITOLAK' ? 'bg-red-50 border border-red-200' :
                                        laporan.status === 'DIPROSES' ? 'bg-yellow-50 border border-yellow-200' :
                                            'bg-blue-50 border border-blue-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(laporan.status)}
                                    <div>
                                        <p className={`font-medium ${laporan.status === 'SELESAI' ? 'text-green-800' :
                                                laporan.status === 'DITOLAK' ? 'text-red-800' :
                                                    laporan.status === 'DIPROSES' ? 'text-yellow-800' :
                                                        'text-blue-800'
                                            }`}>
                                            {LAPORAN_STATUS_LABELS[laporan.status]}
                                        </p>
                                        <p className={`text-sm ${laporan.status === 'SELESAI' ? 'text-green-600' :
                                                laporan.status === 'DITOLAK' ? 'text-red-600' :
                                                    laporan.status === 'DIPROSES' ? 'text-yellow-600' :
                                                        'text-blue-600'
                                            }`}>
                                            {laporan.status === 'DIAJUKAN' && 'Menunggu respon dari pemilik'}
                                            {laporan.status === 'DIPROSES' && 'Sedang dalam perbaikan'}
                                            {laporan.status === 'SELESAI' && 'Masalah sudah diselesaikan'}
                                            {laporan.status === 'DITOLAK' && 'Laporan ditolak'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Prioritas</p>
                                <span className={`badge ${getPriorityBadgeClass(laporan.prioritas)}`}>
                                    {PRIORITAS_LABELS[laporan.prioritas]}
                                </span>
                            </div>

                            {/* Jenis Laporan */}
                            {laporan.jenisLaporan && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Jenis Laporan</p>
                                    <p className="font-medium text-gray-900">{laporan.jenisLaporan}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Update (Pemilik only) */}
                    {isPemilik && laporan.status !== 'SELESAI' && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Ubah Status</h3>
                            </div>
                            <div className="card-body space-y-3">
                                {laporan.status === 'DIAJUKAN' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange('DIPROSES')}
                                            className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                        >
                                            <HiClock className="w-5 h-5" />
                                            Proses Laporan
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('DITOLAK')}
                                            className="btn-outline w-full text-red-600 border-red-300 hover:bg-red-50 inline-flex items-center justify-center gap-2"
                                        >
                                            <HiX className="w-5 h-5" />
                                            Tolak Laporan
                                        </button>
                                    </>
                                )}
                                {laporan.status === 'DIPROSES' && (
                                    <button
                                        onClick={() => handleStatusChange('SELESAI')}
                                        className="btn-success w-full inline-flex items-center justify-center gap-2"
                                    >
                                        <HiCheck className="w-5 h-5" />
                                        Tandai Selesai
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LaporanDetail;
