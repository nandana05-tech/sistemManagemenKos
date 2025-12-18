import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useBarangStore } from '../../features/barang/barangStore';
import { useKamarStore } from '../../features/kamar/kamarStore';
import { barangService } from '../../services/barang.service';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiSave,
    HiCube,
    HiPlus
} from 'react-icons/hi';

const BarangForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const {
        kategori,
        namaBarang,
        isLoading,
        fetchKategori,
        fetchNamaBarang,
        createBarang,
        updateBarang,
        createNamaBarang
    } = useBarangStore();

    const { kamar, fetchKamar } = useKamarStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState('');
    const [showNewNamaBarang, setShowNewNamaBarang] = useState(false);
    const [newNamaBarang, setNewNamaBarang] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            kondisi: 'BAIK',
            jumlah: 1
        }
    });

    useEffect(() => {
        fetchKategori();
        fetchKamar({ limit: 100 });
    }, []);

    // Fetch existing barang data when editing
    useEffect(() => {
        const fetchExistingBarang = async () => {
            if (isEdit && id) {
                setIsFetching(true);
                try {
                    const response = await barangService.getById(id);
                    const data = response.data;

                    if (data) {
                        // Set kategori first to trigger namaBarang fetch
                        if (data.kategoriId) {
                            setSelectedKategori(data.kategoriId.toString());
                        }

                        // Get first inventory item if exists
                        const inventori = data.inventori?.[0];

                        // Populate form after a slight delay to allow namaBarang to load
                        setTimeout(() => {
                            setValue('namaBarangId', data.namaBarangId?.toString() || '');
                            setValue('kondisi', data.kondisi || inventori?.kondisi || 'BAIK');
                            setValue('jumlah', inventori?.jumlah || 1);
                            setValue('kamarId', inventori?.kamarId?.toString() || '');
                            setValue('keterangan', inventori?.catatan || '');
                        }, 300);
                    }
                } catch (error) {
                    console.error('Error fetching barang:', error);
                    toast.error('Gagal mengambil data barang');
                } finally {
                    setIsFetching(false);
                }
            }
        };

        fetchExistingBarang();
    }, [id, isEdit, setValue]);

    useEffect(() => {
        if (selectedKategori) {
            fetchNamaBarang(selectedKategori);
        }
    }, [selectedKategori]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const submitData = {
                namaBarangId: parseInt(data.namaBarangId),
                kategoriId: parseInt(selectedKategori),
                kamarId: parseInt(data.kamarId),
                jumlah: parseInt(data.jumlah),
                kondisi: data.kondisi,
                keterangan: data.keterangan || ''
            };

            if (isEdit) {
                await updateBarang(parseInt(id), submitData);
                toast.success('Barang berhasil diupdate');
            } else {
                await createBarang(submitData);
                toast.success('Barang berhasil ditambahkan');
            }

            navigate('/barang');
        } catch (error) {
            toast.error(error.message || 'Gagal menyimpan barang');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddNamaBarang = async () => {
        if (!newNamaBarang.trim() || !selectedKategori) return;
        try {
            const response = await createNamaBarang({
                namaBarang: newNamaBarang,
                kategoriId: parseInt(selectedKategori)
            });
            toast.success('Nama barang berhasil ditambahkan');
            setNewNamaBarang('');
            setShowNewNamaBarang(false);
            // Refresh nama barang list
            fetchNamaBarang(selectedKategori);
            // Set the newly created nama barang
            if (response.data?.id) {
                setValue('namaBarangId', response.data.id.toString());
            }
        } catch (error) {
            toast.error(error.message || 'Gagal menambah nama barang');
        }
    };

    if (isEdit && (isLoading || isFetching)) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Back Button */}
            <Link to="/barang" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Barang
            </Link>

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">{isEdit ? 'Edit Barang' : 'Tambah Barang Baru'}</h1>
                <p className="page-description">
                    {isEdit ? 'Perbarui informasi barang' : 'Tambahkan barang ke inventaris'}
                </p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Kategori & Nama Barang */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Jenis Barang</h3>
                        </div>
                        <div className="card-body space-y-4">
                            {/* Kategori */}
                            <div>
                                <label className="label">Kategori *</label>
                                <select
                                    className="input"
                                    value={selectedKategori}
                                    onChange={(e) => setSelectedKategori(e.target.value)}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategori.map((k) => (
                                        <option key={k.id} value={k.id}>{k.namaKategori}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama Barang */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="label mb-0">Nama Barang *</label>
                                    {selectedKategori && (
                                        <button
                                            type="button"
                                            onClick={() => setShowNewNamaBarang(!showNewNamaBarang)}
                                            className="text-sm text-primary-600 hover:text-primary-700"
                                        >
                                            {showNewNamaBarang ? 'Pilih yang ada' : '+ Tambah baru'}
                                        </button>
                                    )}
                                </div>

                                {showNewNamaBarang ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input flex-1"
                                            placeholder="Nama barang baru"
                                            value={newNamaBarang}
                                            onChange={(e) => setNewNamaBarang(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddNamaBarang}
                                            disabled={!newNamaBarang.trim()}
                                            className="btn-primary"
                                        >
                                            <HiPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        className={`input ${errors.namaBarangId ? 'input-error' : ''}`}
                                        {...register('namaBarangId', { required: 'Nama barang wajib dipilih' })}
                                        disabled={!selectedKategori}
                                    >
                                        <option value="">
                                            {!selectedKategori ? 'Pilih kategori terlebih dahulu' : 'Pilih Nama Barang'}
                                        </option>
                                        {namaBarang.map((nb) => (
                                            <option key={nb.id} value={nb.id}>{nb.namaBarang}</option>
                                        ))}
                                    </select>
                                )}
                                {errors.namaBarangId && (
                                    <p className="error-message">{errors.namaBarangId.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kamar & Detail */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Lokasi & Detail</h3>
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
                                    {kamar.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.namaKamar} {k.nomorKamar && `(${k.nomorKamar})`}
                                        </option>
                                    ))}
                                </select>
                                {errors.kamarId && (
                                    <p className="error-message">{errors.kamarId.message}</p>
                                )}
                            </div>

                            {/* Jumlah & Kondisi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Jumlah *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className={`input ${errors.jumlah ? 'input-error' : ''}`}
                                        {...register('jumlah', {
                                            required: 'Jumlah wajib diisi',
                                            min: { value: 1, message: 'Minimal 1' }
                                        })}
                                    />
                                    {errors.jumlah && (
                                        <p className="error-message">{errors.jumlah.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="label">Kondisi *</label>
                                    <select
                                        className="input"
                                        {...register('kondisi', { required: true })}
                                    >
                                        <option value="BAIK">Baik</option>
                                        <option value="RUSAK_RINGAN">Rusak Ringan</option>
                                        <option value="RUSAK_BERAT">Rusak Berat</option>
                                    </select>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label className="label">Keterangan</label>
                                <textarea
                                    className="input min-h-[100px]"
                                    placeholder="Keterangan tambahan (opsional)"
                                    {...register('keterangan')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <Link to="/barang" className="btn-outline flex-1 text-center">
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
                                    {isEdit ? 'Update Barang' : 'Simpan Barang'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BarangForm;
