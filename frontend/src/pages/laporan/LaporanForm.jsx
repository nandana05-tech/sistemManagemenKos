import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLaporanStore } from '../../features/laporan/laporanStore';
import { useKamarStore } from '../../features/kamar/kamarStore';
import { useAuthStore } from '../../features/auth/authStore';
import { userService } from '../../services/user.service';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiSave,
    HiExclamation
} from 'react-icons/hi';

const LaporanForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const { user } = useAuthStore();

    const {
        selectedLaporan,
        isLoading,
        fetchLaporanById,
        createLaporan,
        updateLaporan
    } = useLaporanStore();

    const { kamar, fetchKamar } = useKamarStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userKamar, setUserKamar] = useState([]);
    const [loadingKamar, setLoadingKamar] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const fetchUserKamar = async () => {
            setLoadingKamar(true);
            try {
                if (user?.role === 'PEMILIK') {
                    // Pemilik can see all rooms
                    await fetchKamar({ limit: 100 });
                } else if (user?.id) {
                    // Penghuni: fetch rooms from their active riwayatSewa
                    const response = await userService.getRiwayatSewa(user.id);
                    if (response.data && Array.isArray(response.data)) {
                        // Extract kamar from riwayatSewa
                        const rentedRooms = response.data
                            .filter(rs => rs.kamar) // Make sure kamar exists
                            .map(rs => rs.kamar);
                        setUserKamar(rentedRooms);
                    }
                }
            } catch (error) {
                console.error('Error fetching kamar:', error);
                toast.error('Gagal mengambil data kamar');
            } finally {
                setLoadingKamar(false);
            }
        };

        fetchUserKamar();

        if (isEdit) {
            fetchLaporanById(id);
        }
    }, [id, user]);

    useEffect(() => {
        // For Pemilik, use kamar from store
        if (user?.role === 'PEMILIK' && kamar) {
            setUserKamar(kamar);
        }
    }, [kamar, user]);

    useEffect(() => {
        if (isEdit && selectedLaporan) {
            reset({
                kamarId: selectedLaporan.kamarId || '',
                judul: selectedLaporan.judul || '',
                jenisLaporan: selectedLaporan.jenisLaporan || '',
                isiLaporan: selectedLaporan.isiLaporan || '',
                prioritas: selectedLaporan.prioritas || 'NORMAL'
            });
        }
    }, [selectedLaporan, isEdit, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const submitData = {
                ...data,
                kamarId: parseInt(data.kamarId)
            };

            if (isEdit) {
                await updateLaporan(parseInt(id), submitData);
                toast.success('Laporan berhasil diupdate');
            } else {
                await createLaporan(submitData);
                toast.success('Laporan berhasil dibuat');
            }

            navigate('/laporan');
        } catch (error) {
            toast.error(error.message || 'Gagal menyimpan laporan');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEdit && isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
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

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">{isEdit ? 'Edit Laporan' : 'Buat Laporan Kerusakan'}</h1>
                <p className="page-description">
                    {isEdit ? 'Perbarui informasi laporan' : 'Laporkan kerusakan di kamar Anda'}
                </p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Main Form */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Detail Laporan</h3>
                        </div>
                        <div className="card-body space-y-4">
                            {/* Kamar */}
                            <div>
                                <label className="label">Kamar *</label>
                                <select
                                    className={`input ${errors.kamarId ? 'input-error' : ''}`}
                                    {...register('kamarId', { required: 'Kamar wajib dipilih' })}
                                >
                                    <option value="">Pilih Kamar</option>
                                    {userKamar.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.namaKamar} {k.nomorKamar && `(${k.nomorKamar})`}
                                        </option>
                                    ))}
                                </select>
                                {errors.kamarId && (
                                    <p className="error-message">{errors.kamarId.message}</p>
                                )}
                            </div>

                            {/* Judul */}
                            <div>
                                <label className="label">Judul Laporan *</label>
                                <input
                                    type="text"
                                    className={`input ${errors.judul ? 'input-error' : ''}`}
                                    placeholder="Contoh: AC Tidak Dingin"
                                    {...register('judul', {
                                        required: 'Judul wajib diisi',
                                        minLength: { value: 3, message: 'Judul minimal 3 karakter' }
                                    })}
                                />
                                {errors.judul && (
                                    <p className="error-message">{errors.judul.message}</p>
                                )}
                            </div>

                            {/* Jenis Laporan */}
                            <div>
                                <label className="label">Jenis Kerusakan</label>
                                <select className="input" {...register('jenisLaporan')}>
                                    <option value="">Pilih Jenis</option>
                                    <option value="Listrik">Listrik</option>
                                    <option value="Air/Pipa">Air/Pipa</option>
                                    <option value="AC">AC</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Pintu/Jendela">Pintu/Jendela</option>
                                    <option value="Kamar Mandi">Kamar Mandi</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            {/* Prioritas */}
                            <div>
                                <label className="label">Prioritas *</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { value: 'RENDAH', label: 'Rendah', color: 'gray' },
                                        { value: 'NORMAL', label: 'Normal', color: 'blue' },
                                        { value: 'TINGGI', label: 'Tinggi', color: 'orange' },
                                        { value: 'URGENT', label: 'Urgent', color: 'red' }
                                    ].map((priority) => (
                                        <label
                                            key={priority.value}
                                            className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all
                        ${errors.prioritas ? 'border-red-300' : 'border-gray-200'}
                        hover:border-${priority.color}-400
                      `}
                                        >
                                            <input
                                                type="radio"
                                                value={priority.value}
                                                {...register('prioritas', { required: 'Prioritas wajib dipilih' })}
                                                className="sr-only peer"
                                            />
                                            <div className="flex items-center gap-2 peer-checked:text-primary-600">
                                                <div className={`w-3 h-3 rounded-full ${priority.value === 'RENDAH' ? 'bg-gray-400' :
                                                    priority.value === 'NORMAL' ? 'bg-blue-500' :
                                                        priority.value === 'TINGGI' ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}></div>
                                                <span className="font-medium">{priority.label}</span>
                                            </div>
                                            <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-primary-600"></div>
                                        </label>
                                    ))}
                                </div>
                                {errors.prioritas && (
                                    <p className="error-message">{errors.prioritas.message}</p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="label">Deskripsi Kerusakan</label>
                                <textarea
                                    className="input min-h-[150px]"
                                    placeholder="Jelaskan detail kerusakan yang terjadi..."
                                    {...register('isiLaporan')}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Berikan detail yang jelas agar pemilik dapat memahami masalah dengan baik.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <HiExclamation className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-800">Tips membuat laporan</p>
                                <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                                    <li>Berikan judul yang jelas dan singkat</li>
                                    <li>Jelaskan kapan kerusakan pertama kali terjadi</li>
                                    <li>Sebutkan dampak kerusakan terhadap aktivitas Anda</li>
                                    <li>Pilih prioritas sesuai dengan tingkat urgensi</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <Link to="/laporan" className="btn-outline flex-1 text-center">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <HiSave className="w-5 h-5" />
                                    {isEdit ? 'Update Laporan' : 'Kirim Laporan'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LaporanForm;
