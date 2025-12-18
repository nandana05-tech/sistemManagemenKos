import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useKamarStore } from '../../features/kamar/kamarStore';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiSave,
    HiPlus,
    HiTrash,
    HiPhotograph,
    HiX
} from 'react-icons/hi';

const KamarForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const {
        selectedKamar,
        kategori,
        isLoading,
        fetchKamarById,
        fetchKategori,
        createKamar,
        updateKamar
    } = useKamarStore();

    const [fasilitas, setFasilitas] = useState([]);
    const [newFasilitas, setNewFasilitas] = useState('');
    const [photos, setPhotos] = useState([]);
    const [photoFiles, setPhotoFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchKategori();
        if (isEdit) {
            fetchKamarById(id);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit && selectedKamar) {
            reset({
                namaKamar: selectedKamar.namaKamar || '',
                nomorKamar: selectedKamar.nomorKamar || '',
                kategoriId: selectedKamar.kategoriId || '',
                hargaPerBulan: selectedKamar.hargaPerBulan || '',
                hargaPerHarian: selectedKamar.hargaPerHarian || '',
                luasKamar: selectedKamar.luasKamar || '',
                lantai: selectedKamar.lantai || '',
                deskripsi: selectedKamar.deskripsi || '',
                stokKamar: selectedKamar.stokKamar || 1,
                status: selectedKamar.status || 'TERSEDIA'
            });

            // Load existing fasilitas
            if (selectedKamar.fasilitasDetail) {
                setFasilitas(selectedKamar.fasilitasDetail.map(f => ({
                    id: f.id,
                    namaFasilitas: f.namaFasilitas,
                    kondisi: f.kondisi || 'Baik',
                    isNew: false
                })));
            }

            // Load existing photos
            if (selectedKamar.fotoKamar) {
                setPhotos(selectedKamar.fotoKamar.map(f => ({
                    id: f.id,
                    url: f.foto,
                    isExisting: true
                })));
            }
        }
    }, [selectedKamar, isEdit, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Prepare data - don't send null values
            const submitData = {
                namaKamar: data.namaKamar,
                nomorKamar: data.nomorKamar || undefined,
                deskripsi: data.deskripsi || undefined,
                status: data.status || 'TERSEDIA',
                ...(data.kategoriId && { kategoriId: parseInt(data.kategoriId) }),
                ...(data.hargaPerBulan && { hargaPerBulan: parseFloat(data.hargaPerBulan) }),
                ...(data.hargaPerHarian && { hargaPerHarian: parseFloat(data.hargaPerHarian) }),
                ...(data.luasKamar && { luasKamar: parseInt(data.luasKamar) }),
                ...(data.lantai && { lantai: parseInt(data.lantai) }),
                ...(data.stokKamar && { stokKamar: parseInt(data.stokKamar) })
            };

            let kamarId;

            if (isEdit) {
                // Include fasilitas for update
                submitData.fasilitas = fasilitas.map(f => ({
                    namaFasilitas: f.namaFasilitas,
                    kondisi: f.kondisi || 'Baik'
                }));
                await updateKamar(id, submitData);
                kamarId = id;
                toast.success('Kamar berhasil diupdate');
            } else {
                // Include fasilitas for new kamar
                if (fasilitas.length > 0) {
                    submitData.fasilitas = fasilitas.map(f => ({
                        namaFasilitas: f.namaFasilitas,
                        kondisi: f.kondisi || 'Baik'
                    }));
                }
                const response = await createKamar(submitData);
                kamarId = response.data?.id;
                toast.success('Kamar berhasil dibuat');
            }

            // Upload new photos if any
            const newPhotoFiles = photos.filter(p => !p.isExisting && p.file).map(p => p.file);
            if (newPhotoFiles.length > 0 && kamarId) {
                try {
                    const { kamarService } = await import('../../services/kamar.service');
                    await kamarService.uploadPhotos(kamarId, newPhotoFiles);
                    toast.success('Foto berhasil diupload');
                } catch (uploadError) {
                    console.error('Error uploading photos:', uploadError);
                    toast.error('Kamar tersimpan, tapi gagal upload foto');
                }
            }

            navigate('/kamar');
        } catch (error) {
            toast.error(error.message || 'Gagal menyimpan kamar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddFasilitas = () => {
        if (newFasilitas.trim()) {
            setFasilitas([
                ...fasilitas,
                {
                    id: `new-${Date.now()}`,
                    namaFasilitas: newFasilitas.trim(),
                    kondisi: 'Baik',
                    isNew: true
                }
            ]);
            setNewFasilitas('');
        }
    };

    const handleRemoveFasilitas = (fasilitasId) => {
        setFasilitas(fasilitas.filter(f => f.id !== fasilitasId));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            id: `new-${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            file: file,
            isExisting: false
        }));
        setPhotos([...photos, ...newPhotos]);
        setPhotoFiles([...photoFiles, ...files]);
    };

    const handleRemovePhoto = (photoId) => {
        setPhotos(photos.filter(p => p.id !== photoId));
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
            <Link to="/kamar" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Kamar
            </Link>

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">{isEdit ? 'Edit Kamar' : 'Tambah Kamar Baru'}</h1>
                <p className="page-description">
                    {isEdit ? 'Perbarui informasi kamar' : 'Isi form berikut untuk menambah kamar baru'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Informasi Dasar</h3>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Nama Kamar *</label>
                                        <input
                                            type="text"
                                            className={`input ${errors.namaKamar ? 'input-error' : ''}`}
                                            placeholder="Contoh: Kamar Standard A101"
                                            {...register('namaKamar', { required: 'Nama kamar wajib diisi' })}
                                        />
                                        {errors.namaKamar && (
                                            <p className="error-message">{errors.namaKamar.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="label">Nomor Kamar</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Contoh: A101"
                                            {...register('nomorKamar')}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Kategori</label>
                                        <select className="input" {...register('kategoriId')}>
                                            <option value="">Pilih Kategori</option>
                                            {kategori.map((k) => (
                                                <option key={k.id} value={k.id}>{k.namaKategori}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Status</label>
                                        <select className="input" {...register('status')}>
                                            <option value="TERSEDIA">Tersedia</option>
                                            <option value="TERISI">Terisi</option>
                                            <option value="PERBAIKAN">Dalam Perbaikan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Deskripsi</label>
                                    <textarea
                                        className="input min-h-[120px]"
                                        placeholder="Deskripsi kamar..."
                                        {...register('deskripsi')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Harga & Spesifikasi</h3>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Harga per Bulan (Rp)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="1500000"
                                            {...register('hargaPerBulan')}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Harga per Hari (Rp)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="100000"
                                            {...register('hargaPerHarian')}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="label">Luas Kamar (m²)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="12"
                                            {...register('luasKamar')}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Lantai</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="1"
                                            {...register('lantai')}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Stok Kamar</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="1"
                                            {...register('stokKamar')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Foto Kamar</h3>
                            </div>
                            <div className="card-body">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                            <img
                                                src={photo.url}
                                                alt="Foto kamar"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(photo.id)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <HiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-600 hover:bg-primary-50 transition-colors">
                                        <HiPhotograph className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Upload Foto</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Format: JPG, PNG. Maksimal 5MB per file.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Fasilitas & Submit */}
                    <div className="space-y-6">
                        {/* Fasilitas */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="font-semibold text-gray-900">Fasilitas</h3>
                            </div>
                            <div className="card-body">
                                {/* Add Fasilitas */}
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        className="input flex-1"
                                        placeholder="Nama fasilitas"
                                        value={newFasilitas}
                                        onChange={(e) => setNewFasilitas(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFasilitas())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFasilitas}
                                        className="btn-outline p-2"
                                    >
                                        <HiPlus className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Fasilitas List */}
                                <div className="space-y-2">
                                    {fasilitas.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-4">
                                            Belum ada fasilitas. Tambahkan fasilitas di atas.
                                        </p>
                                    ) : (
                                        fasilitas.map((f) => (
                                            <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-900">{f.namaFasilitas}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFasilitas(f.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="card">
                            <div className="card-body space-y-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner"></span>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <HiSave className="w-5 h-5" />
                                            {isEdit ? 'Update Kamar' : 'Simpan Kamar'}
                                        </>
                                    )}
                                </button>
                                <Link to="/kamar" className="btn-outline w-full text-center block">
                                    Batal
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default KamarForm;
