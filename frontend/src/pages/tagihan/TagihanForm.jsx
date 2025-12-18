import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTagihanStore } from '../../features/tagihan/tagihanStore';
import { useUserStore } from '../../features/users/userStore';
import { formatRupiah } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiSave,
    HiCurrencyDollar,
    HiCalendar
} from 'react-icons/hi';

const TagihanForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const {
        selectedTagihan,
        isLoading,
        fetchTagihanById,
        createTagihan,
        updateTagihan
    } = useTagihanStore();

    const { users, fetchUsers } = useUserStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [riwayatSewa, setRiwayatSewa] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm();

    const selectedUserId = watch('userId');

    useEffect(() => {
        fetchUsers({ role: 'PENGHUNI', limit: 100 });
        if (isEdit) {
            fetchTagihanById(id);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit && selectedTagihan) {
            // First fetch riwayatSewa for the user, then reset form
            const loadEditData = async () => {
                try {
                    if (selectedTagihan.userId) {
                        const { userService } = await import('../../services/user.service');
                        const response = await userService.getRiwayatSewa(selectedTagihan.userId);
                        setRiwayatSewa(response.data?.data || response.data || []);
                    }
                } catch (error) {
                    console.error('Error fetching riwayat sewa:', error);
                }

                // Now reset form after riwayatSewa is loaded
                const dueDate = new Date(selectedTagihan.tanggalJatuhTempo);
                reset({
                    userId: selectedTagihan.userId?.toString() || '',
                    riwayatSewaId: selectedTagihan.riwayatSewaId?.toString() || '',
                    jenisTagihan: selectedTagihan.jenisTagihan || '',
                    nominal: selectedTagihan.nominal || '',
                    tanggalJatuhTempo: dueDate.toISOString().split('T')[0],
                    keterangan: selectedTagihan.keterangan || '',
                    status: selectedTagihan.status || 'BELUM_LUNAS'
                });
            };
            loadEditData();
        }
    }, [selectedTagihan, isEdit, reset]);

    // Fetch riwayat sewa when user changes (for create mode)
    useEffect(() => {
        if (selectedUserId && !isEdit) {
            const fetchRiwayat = async () => {
                try {
                    const { userService } = await import('../../services/user.service');
                    const response = await userService.getRiwayatSewa(selectedUserId);
                    setRiwayatSewa(response.data?.data || response.data || []);
                } catch (error) {
                    console.error('Error fetching riwayat sewa:', error);
                    setRiwayatSewa([]);
                }
            };
            fetchRiwayat();
        } else if (!selectedUserId && !isEdit) {
            setRiwayatSewa([]);
        }
    }, [selectedUserId, isEdit]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const submitData = {
                ...data,
                userId: parseInt(data.userId),
                riwayatSewaId: parseInt(data.riwayatSewaId),
                nominal: parseFloat(data.nominal),
                tanggalJatuhTempo: data.tanggalJatuhTempo
            };

            if (isEdit) {
                await updateTagihan(parseInt(id), submitData);
                toast.success('Tagihan berhasil diupdate');
            } else {
                await createTagihan(submitData);
                toast.success('Tagihan berhasil dibuat');
            }

            navigate('/tagihan');
        } catch (error) {
            toast.error(error.message || 'Gagal menyimpan tagihan');
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
            <Link to="/tagihan" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Tagihan
            </Link>

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">{isEdit ? 'Edit Tagihan' : 'Buat Tagihan Baru'}</h1>
                <p className="page-description">
                    {isEdit ? 'Perbarui informasi tagihan' : 'Isi form berikut untuk membuat tagihan baru'}
                </p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Penghuni Selection */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Informasi Penghuni</h3>
                        </div>
                        <div className="card-body space-y-4">
                            <div>
                                <label className="label">Penghuni *</label>
                                <select
                                    className={`input ${errors.userId ? 'input-error' : ''}`}
                                    {...register('userId', { required: 'Penghuni wajib dipilih' })}
                                    disabled={isEdit}
                                >
                                    <option value="">Pilih Penghuni</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} - {user.email}
                                        </option>
                                    ))}
                                </select>
                                {errors.userId && (
                                    <p className="error-message">{errors.userId.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Kamar / Riwayat Sewa *</label>
                                <select
                                    className={`input ${errors.riwayatSewaId ? 'input-error' : ''}`}
                                    {...register('riwayatSewaId', { required: 'Riwayat sewa wajib dipilih' })}
                                    disabled={isEdit || !selectedUserId}
                                >
                                    <option value="">
                                        {!selectedUserId ? 'Pilih penghuni terlebih dahulu' : 'Pilih Kamar'}
                                    </option>
                                    {riwayatSewa.map((rs) => (
                                        <option key={rs.id} value={rs.id}>
                                            {rs.kamar?.namaKamar} - {rs.kodeSewa}
                                        </option>
                                    ))}
                                </select>
                                {errors.riwayatSewaId && (
                                    <p className="error-message">{errors.riwayatSewaId.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tagihan Details */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Detail Tagihan</h3>
                        </div>
                        <div className="card-body space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Jenis Tagihan *</label>
                                    <select
                                        className={`input ${errors.jenisTagihan ? 'input-error' : ''}`}
                                        {...register('jenisTagihan', { required: 'Jenis tagihan wajib dipilih' })}
                                    >
                                        <option value="">Pilih Jenis</option>
                                        <option value="SEWA_BULANAN">Sewa Bulanan</option>
                                        <option value="LISTRIK">Listrik</option>
                                        <option value="AIR">Air</option>
                                        <option value="LAINNYA">Lainnya</option>
                                    </select>
                                    {errors.jenisTagihan && (
                                        <p className="error-message">{errors.jenisTagihan.message}</p>
                                    )}
                                </div>

                                {isEdit && (
                                    <div>
                                        <label className="label">Status</label>
                                        <select className="input" {...register('status')}>
                                            <option value="BELUM_LUNAS">Belum Lunas</option>
                                            <option value="LUNAS">Lunas</option>
                                            <option value="JATUH_TEMPO">Jatuh Tempo</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Nominal (Rp) *</label>
                                    <div className="relative">
                                        <HiCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            className={`input pl-10 ${errors.nominal ? 'input-error' : ''}`}
                                            placeholder="1500000"
                                            {...register('nominal', {
                                                required: 'Nominal wajib diisi',
                                                min: { value: 1, message: 'Nominal harus lebih dari 0' }
                                            })}
                                        />
                                    </div>
                                    {errors.nominal && (
                                        <p className="error-message">{errors.nominal.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">Tanggal Jatuh Tempo *</label>
                                    <div className="relative">
                                        <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            className={`input pl-10 ${errors.tanggalJatuhTempo ? 'input-error' : ''}`}
                                            {...register('tanggalJatuhTempo', { required: 'Tanggal jatuh tempo wajib diisi' })}
                                        />
                                    </div>
                                    {errors.tanggalJatuhTempo && (
                                        <p className="error-message">{errors.tanggalJatuhTempo.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="label">Keterangan</label>
                                <textarea
                                    className="input min-h-[100px]"
                                    placeholder="Keterangan tambahan..."
                                    {...register('keterangan')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <Link to="/tagihan" className="btn-outline flex-1 text-center">
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
                                    {isEdit ? 'Update Tagihan' : 'Simpan Tagihan'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagihanForm;
