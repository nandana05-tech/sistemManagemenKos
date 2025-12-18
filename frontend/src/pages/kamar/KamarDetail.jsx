import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useKamarStore } from '../../features/kamar/kamarStore';
import { useAuthStore } from '../../features/auth/authStore';
import { kamarService } from '../../services/kamar.service';
import { paymentService } from '../../services/payment.service';
import { formatRupiah, formatDate } from '../../utils/helpers';
import { KAMAR_STATUS_LABELS, KAMAR_STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiPencil,
    HiTrash,
    HiOfficeBuilding,
    HiLocationMarker,
    HiCurrencyDollar,
    HiCheck,
    HiX,
    HiChevronLeft,
    HiChevronRight,
    HiShoppingCart,
    HiCreditCard
} from 'react-icons/hi';

const KamarDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        selectedKamar: kamar,
        isLoading,
        fetchKamarById,
        deleteKamar,
        updateKamarStatus
    } = useKamarStore();

    const isPemilik = user?.role === 'PEMILIK';
    const isPenghuni = user?.role === 'PENGHUNI';
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Booking state
    const [durasiSewa, setDurasiSewa] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [showBookingConfirm, setShowBookingConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchKamarById(id);
        }
    }, [id]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteKamar(id);
            toast.success('Kamar berhasil dihapus');
            navigate('/kamar');
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus kamar');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateKamarStatus(id, newStatus);
            toast.success('Status kamar berhasil diupdate');
            // Refetch kamar data to update rental status display
            await fetchKamarById(id);
        } catch (error) {
            toast.error(error.message || 'Gagal mengupdate status');
        }
    };

    const getStatusBadgeClass = (status) => {
        const colorMap = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger'
        };
        return colorMap[KAMAR_STATUS_COLORS[status]] || 'badge-primary';
    };

    const handleBookRoom = async () => {
        if (!user) {
            toast.error('Silakan login terlebih dahulu');
            navigate('/login');
            return;
        }

        setIsBooking(true);
        try {
            // Create booking
            const bookingResponse = await kamarService.bookRoom(id, durasiSewa);
            const tagihanId = bookingResponse.data?.tagihan?.id;

            if (!tagihanId) {
                throw new Error('Gagal membuat tagihan');
            }

            toast.success('Booking berhasil! Melanjutkan ke pembayaran...');

            // Create payment
            const paymentResponse = await paymentService.create({ tagihanId });

            if (paymentResponse.data?.redirectUrl) {
                window.location.href = paymentResponse.data.redirectUrl;
            } else if (paymentResponse.data?.snapRedirectUrl) {
                window.location.href = paymentResponse.data.snapRedirectUrl;
            } else {
                // Redirect to tagihan page to pay later
                toast.info('Silakan lakukan pembayaran di halaman tagihan');
                navigate('/tagihan');
            }
        } catch (error) {
            toast.error(error.message || 'Gagal melakukan booking');
        } finally {
            setIsBooking(false);
            setShowBookingConfirm(false);
        }
    };

    const totalHarga = kamar?.hargaPerBulan ? parseFloat(kamar.hargaPerBulan) * durasiSewa : 0;

    const nextPhoto = () => {
        if (kamar?.fotoKamar?.length > 0) {
            setCurrentPhotoIndex((prev) =>
                prev === kamar.fotoKamar.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevPhoto = () => {
        if (kamar?.fotoKamar?.length > 0) {
            setCurrentPhotoIndex((prev) =>
                prev === 0 ? kamar.fotoKamar.length - 1 : prev - 1
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    if (!kamar) {
        return (
            <div className="card">
                <div className="card-body text-center py-12">
                    <HiOfficeBuilding className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Kamar tidak ditemukan</h3>
                    <Link to="/kamar" className="btn-primary">
                        Kembali ke Daftar Kamar
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Back Button */}
            <Link to="/kamar" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Kamar
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Photos & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Photo Gallery */}
                    <div className="card">
                        <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden rounded-t-xl">
                            {kamar.fotoKamar?.length > 0 ? (
                                <>
                                    <img
                                        src={kamar.fotoKamar[currentPhotoIndex]?.foto}
                                        alt={kamar.namaKamar}
                                        className="w-full h-full object-cover"
                                    />
                                    {kamar.fotoKamar.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevPhoto}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <HiChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextPhoto}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <HiChevronRight className="w-6 h-6" />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {kamar.fotoKamar.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentPhotoIndex(index)}
                                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <HiOfficeBuilding className="w-24 h-24 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {kamar.fotoKamar?.length > 1 && (
                            <div className="p-4 flex gap-2 overflow-x-auto">
                                {kamar.fotoKamar.map((foto, index) => (
                                    <button
                                        key={foto.id}
                                        onClick={() => setCurrentPhotoIndex(index)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${index === currentPhotoIndex ? 'border-primary-600' : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={foto.foto}
                                            alt={`${kamar.namaKamar} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Deskripsi</h3>
                        </div>
                        <div className="card-body">
                            <p className="text-gray-600 whitespace-pre-line">
                                {kamar.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                        </div>
                    </div>

                    {/* Fasilitas */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Fasilitas</h3>
                        </div>
                        <div className="card-body">
                            {kamar.fasilitasDetail?.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {kamar.fasilitasDetail.map((fasilitas) => (
                                        <div
                                            key={fasilitas.id}
                                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-gray-900">{fasilitas.namaFasilitas}</p>
                                                {fasilitas.kondisi && (
                                                    <p className="text-xs text-gray-500">{fasilitas.kondisi}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Belum ada fasilitas terdaftar</p>
                            )}
                        </div>
                    </div>

                    {/* Inventori */}
                    {kamar.inventori?.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Inventori Kamar</h3>
                            </div>
                            <div className="card-body">
                                <div className="divide-y divide-gray-200">
                                    {kamar.inventori.map((item) => (
                                        <div key={item.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.barang?.namaBarang?.namaBarang || 'Unknown'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.kondisi && `Kondisi: ${item.kondisi}`}
                                                </p>
                                            </div>
                                            <span className="text-gray-600">×{item.jumlah}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Riwayat Sewa - Pemilik Only */}
                    {isPemilik && kamar.riwayatSewa?.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Riwayat Sewa</h3>
                            </div>
                            <div className="card-body">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-gray-600">Kode</th>
                                                <th className="px-3 py-2 text-left text-gray-600">Penyewa</th>
                                                <th className="px-3 py-2 text-left text-gray-600">Periode</th>
                                                <th className="px-3 py-2 text-left text-gray-600">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {kamar.riwayatSewa.map((sewa) => (
                                                <tr key={sewa.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 font-medium text-gray-900">
                                                        {sewa.kodeSewa}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <p className="text-gray-900">{sewa.user?.name}</p>
                                                        <p className="text-xs text-gray-500">{sewa.user?.noTelepon}</p>
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-600">
                                                        {formatDate(sewa.tanggalMulai)} - {formatDate(sewa.tanggalBerakhir)}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <span className={`badge ${sewa.status === 'AKTIF' ? 'badge-success' :
                                                            sewa.status === 'SELESAI' ? 'badge-info' : 'badge-warning'
                                                            }`}>
                                                            {sewa.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Summary & Actions */}
                <div className="space-y-6">
                    {/* Room Summary */}
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{kamar.namaKamar}</h1>
                                    {kamar.nomorKamar && (
                                        <p className="text-gray-500">No. {kamar.nomorKamar}</p>
                                    )}
                                </div>
                                <span className={`badge ${getStatusBadgeClass(kamar.status)}`}>
                                    {KAMAR_STATUS_LABELS[kamar.status]}
                                </span>
                            </div>

                            {kamar.kategori && (
                                <p className="text-gray-600 mb-4">{kamar.kategori.namaKategori}</p>
                            )}

                            <div className="space-y-3 mb-6">
                                {kamar.luasKamar && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <HiLocationMarker className="w-5 h-5" />
                                        <span>Luas: {kamar.luasKamar} m²</span>
                                    </div>
                                )}
                                {kamar.lantai && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <HiOfficeBuilding className="w-5 h-5" />
                                        <span>Lantai: {kamar.lantai}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm text-gray-500">Harga per bulan</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    {formatRupiah(kamar.hargaPerBulan)}
                                </p>
                                {kamar.hargaPerHarian && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        atau {formatRupiah(kamar.hargaPerHarian)}/hari
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Owner Actions */}
                    {isPemilik && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Aksi</h3>
                            </div>
                            <div className="card-body space-y-3">
                                <Link
                                    to={`/kamar/${kamar.id}/edit`}
                                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                >
                                    <HiPencil className="w-5 h-5" />
                                    Edit Kamar
                                </Link>

                                {/* Status Change */}
                                <div>
                                    <label className="label">Ubah Status</label>
                                    <select
                                        value={kamar.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="TERSEDIA">Tersedia</option>
                                        <option value="TERISI">Terisi</option>
                                        <option value="PERBAIKAN">Dalam Perbaikan</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="btn-outline w-full text-red-600 border-red-300 hover:bg-red-50 inline-flex items-center justify-center gap-2"
                                >
                                    <HiTrash className="w-5 h-5" />
                                    Hapus Kamar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Booking Section for Penghuni */}
                    {isPenghuni && kamar.status === 'TERSEDIA' && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <HiShoppingCart className="w-5 h-5" />
                                    Pesan Kamar Ini
                                </h3>
                            </div>
                            <div className="card-body space-y-4">
                                {/* Duration Selector */}
                                <div>
                                    <label className="label">Durasi Sewa</label>
                                    <select
                                        value={durasiSewa}
                                        onChange={(e) => setDurasiSewa(parseInt(e.target.value))}
                                        className="input w-full"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 9, 12].map((bulan) => (
                                            <option key={bulan} value={bulan}>
                                                {bulan} Bulan
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Harga per bulan</span>
                                        <span>{formatRupiah(kamar.hargaPerBulan)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Durasi</span>
                                        <span>{durasiSewa} bulan</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary-600">{formatRupiah(totalHarga)}</span>
                                    </div>
                                </div>

                                {/* Book Button */}
                                <button
                                    onClick={() => setShowBookingConfirm(true)}
                                    disabled={isBooking}
                                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                >
                                    <HiCreditCard className="w-5 h-5" />
                                    Pesan & Bayar Sekarang
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    Dengan memesan, Anda akan diarahkan ke halaman pembayaran.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Room Not Available Notice for Penghuni */}
                    {isPenghuni && kamar.status !== 'TERSEDIA' && (
                        <div className="card">
                            <div className="card-body text-center py-6">
                                <HiX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">Kamar tidak tersedia</p>
                                <p className="text-sm text-gray-500">
                                    Kamar ini sedang {KAMAR_STATUS_LABELS[kamar.status]?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Kamar?</h3>
                            <p className="text-gray-500 mb-6">
                                Apakah Anda yakin ingin menghapus kamar <strong>{kamar.namaKamar}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
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

            {/* Booking Confirmation Modal */}
            {showBookingConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiShoppingCart className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Pemesanan</h3>
                            <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="font-medium text-gray-900 mb-2">{kamar?.namaKamar}</p>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Durasi sewa</span>
                                        <span>{durasiSewa} bulan</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Harga per bulan</span>
                                        <span>{formatRupiah(kamar?.hargaPerBulan)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-bold text-gray-900">
                                        <span>Total Pembayaran</span>
                                        <span className="text-primary-600">{formatRupiah(totalHarga)}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                Anda akan diarahkan ke halaman pembayaran setelah konfirmasi.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowBookingConfirm(false)}
                                    className="btn-outline flex-1"
                                    disabled={isBooking}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleBookRoom}
                                    className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                                    disabled={isBooking}
                                >
                                    {isBooking ? (
                                        <>
                                            <span className="spinner"></span>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <HiCreditCard className="w-5 h-5" />
                                            Bayar Sekarang
                                        </>
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

export default KamarDetail;
