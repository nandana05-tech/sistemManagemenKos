import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBarangStore } from '../../features/barang/barangStore';
import { useAuthStore } from '../../features/auth/authStore';
import { formatRupiah, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
    HiPlus,
    HiFilter,
    HiCube,
    HiChevronLeft,
    HiChevronRight,
    HiEye,
    HiPencil,
    HiTrash,
    HiDotsVertical,
    HiTag,
    HiOfficeBuilding
} from 'react-icons/hi';

const BarangList = () => {
    const { user } = useAuthStore();
    const {
        barang,
        kategori,
        meta,
        isLoading,
        fetchBarang,
        fetchKategori,
        deleteBarang,
        createKategori,
        deleteKategori
    } = useBarangStore();

    const isPemilik = user?.role === 'PEMILIK';

    const [filters, setFilters] = useState({
        kategoriId: '',
        page: 1,
        limit: 10
    });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, barang: null });
    const [deleteKategoriModal, setDeleteKategoriModal] = useState({ show: false, kategori: null });
    const [kategoriModal, setKategoriModal] = useState({ show: false });
    const [newKategori, setNewKategori] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletingKategori, setIsDeletingKategori] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchKategori();
    }, []);

    useEffect(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.kategoriId && { kategoriId: filters.kategoriId })
        };
        fetchBarang(params);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleDelete = async () => {
        if (!deleteModal.barang) return;
        setIsDeleting(true);
        try {
            await deleteBarang(deleteModal.barang.id);
            toast.success('Barang berhasil dihapus');
            setDeleteModal({ show: false, barang: null });
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus barang');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreateKategori = async () => {
        if (!newKategori.trim()) return;
        setIsSubmitting(true);
        try {
            await createKategori({ namaKategori: newKategori });
            toast.success('Kategori berhasil ditambahkan');
            setNewKategori('');
            setKategoriModal({ show: false });
        } catch (error) {
            toast.error(error.message || 'Gagal menambah kategori');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteKategori = async () => {
        if (!deleteKategoriModal.kategori) return;
        setIsDeletingKategori(true);
        try {
            await deleteKategori(deleteKategoriModal.kategori.id);
            toast.success('Kategori berhasil dihapus');
            setDeleteKategoriModal({ show: false, kategori: null });
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus kategori');
        } finally {
            setIsDeletingKategori(false);
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Inventaris Barang</h1>
                    <p className="page-description">
                        {isPemilik ? 'Kelola daftar barang dan inventaris kamar' : 'Lihat daftar inventaris'}
                    </p>
                </div>
                {isPemilik && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setKategoriModal({ show: true })}
                            className="btn-outline inline-flex items-center gap-2"
                        >
                            <HiTag className="w-5 h-5" />
                            Kategori
                        </button>
                        <Link to="/barang/new" className="btn-primary inline-flex items-center gap-2">
                            <HiPlus className="w-5 h-5" />
                            Tambah Barang
                        </Link>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <select
                                className="input"
                                value={filters.kategoriId}
                                onChange={(e) => handleFilterChange('kategoriId', e.target.value)}
                            >
                                <option value="">Semua Kategori</option>
                                {kategori.map((k) => (
                                    <option key={k.id} value={k.id}>{k.namaKategori}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({ kategoriId: '', page: 1, limit: 10 })}
                            className="btn-outline"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Barang Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                </div>
            ) : barang.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-12">
                        <HiCube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada barang</h3>
                        <p className="text-gray-500 mb-4">
                            {filters.kategoriId ? 'Tidak ada barang dalam kategori ini' : 'Belum ada barang yang terdaftar'}
                        </p>
                        {isPemilik && (
                            <Link to="/barang/new" className="btn-primary inline-flex items-center gap-2">
                                <HiPlus className="w-5 h-5" />
                                Tambah Barang Pertama
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama Barang</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kategori</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kamar</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Jumlah</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kondisi</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                                    {isPemilik && (
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {barang.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <HiCube className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.namaBarang?.nama || item.nama || 'N/A'}</p>
                                                    {item.keterangan && (
                                                        <p className="text-sm text-gray-500 truncate max-w-[200px]">{item.keterangan}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="badge badge-info">
                                                {item.namaBarang?.kategori?.namaKategori || item.kategori?.namaKategori || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <HiOfficeBuilding className="w-4 h-4" />
                                                {item.kamar?.namaKamar || '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-semibold text-gray-900">{item.jumlah || 1}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${item.kondisi === 'BAIK' ? 'badge-success' :
                                                item.kondisi === 'RUSAK_RINGAN' ? 'badge-warning' :
                                                    item.kondisi === 'RUSAK_BERAT' ? 'badge-danger' : 'badge-info'
                                                }`}>
                                                {item.kondisi?.replace('_', ' ') || 'Baik'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {formatDate(item.createdAt)}
                                        </td>
                                        {isPemilik && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/barang/${item.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteModal({ show: true, barang: item })}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
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
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} barang
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Barang?</h3>
                            <p className="text-gray-500 mb-6">
                                Barang ini akan dihapus dari inventaris.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, barang: null })}
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

            {/* Kategori Modal */}
            {kategoriModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kelola Kategori</h3>

                        {/* Add new kategori */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="input flex-1"
                                placeholder="Nama kategori baru"
                                value={newKategori}
                                onChange={(e) => setNewKategori(e.target.value)}
                            />
                            <button
                                onClick={handleCreateKategori}
                                disabled={isSubmitting || !newKategori.trim()}
                                className="btn-primary"
                            >
                                {isSubmitting ? '...' : 'Tambah'}
                            </button>
                        </div>

                        {/* List kategori */}
                        <div className="max-h-[200px] overflow-y-auto space-y-2 mb-4">
                            {kategori.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Belum ada kategori</p>
                            ) : (
                                kategori.map((k) => (
                                    <div key={k.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-900 font-medium">{k.namaKategori}</span>
                                        <button
                                            onClick={() => setDeleteKategoriModal({ show: true, kategori: k })}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => setKategoriModal({ show: false })}
                            className="btn-outline w-full"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Kategori Modal */}
            {deleteKategoriModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Kategori?</h3>
                            <p className="text-gray-500 mb-6">
                                Kategori <span className="font-semibold">"{deleteKategoriModal.kategori?.namaKategori}"</span> akan dihapus.
                                Pastikan tidak ada barang yang menggunakan kategori ini.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteKategoriModal({ show: false, kategori: null })}
                                    className="btn-outline flex-1"
                                    disabled={isDeletingKategori}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteKategori}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                                    disabled={isDeletingKategori}
                                >
                                    {isDeletingKategori ? (
                                        <>
                                            <span className="spinner w-4 h-4"></span>
                                            Menghapus...
                                        </>
                                    ) : (
                                        'Ya, Hapus'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div className="fixed inset-0 z-[5]" onClick={() => setActiveDropdown(null)} />
            )}
        </div>
    );
};

export default BarangList;
