import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKamarStore } from '../../features/kamar/kamarStore';
import { useAuthStore } from '../../features/auth/authStore';
import { formatRupiah } from '../../utils/helpers';
import { KAMAR_STATUS_LABELS, KAMAR_STATUS_COLORS } from '../../utils/constants';
import {
    HiPlus,
    HiSearch,
    HiFilter,
    HiViewGrid,
    HiViewList,
    HiOfficeBuilding,
    HiLocationMarker,
    HiCurrencyDollar,
    HiChevronLeft,
    HiChevronRight
} from 'react-icons/hi';

const KamarList = () => {
    const { user } = useAuthStore();
    const {
        kamar,
        kategori,
        meta,
        isLoading,
        fetchKamar,
        fetchKategori
    } = useKamarStore();

    const isPemilik = user?.role === 'PEMILIK';

    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        kategoriId: '',
        page: 1,
        limit: 12
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchKategori();
    }, []);

    useEffect(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.search && { search: filters.search }),
            ...(filters.status && { status: filters.status }),
            ...(filters.kategoriId && { kategoriId: filters.kategoriId })
        };
        fetchKamar(params);
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusBadgeClass = (status) => {
        const colorMap = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger'
        };
        return colorMap[KAMAR_STATUS_COLORS[status]] || 'badge-primary';
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="page-title">Daftar Kamar</h1>
                    <p className="page-description">
                        {meta?.total || 0} kamar tersedia
                    </p>
                </div>
                {isPemilik && (
                    <Link to="/kamar/new" className="btn-primary inline-flex items-center gap-2">
                        <HiPlus className="w-5 h-5" />
                        Tambah Kamar
                    </Link>
                )}
            </div>

            {/* Search and Filters */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari kamar..."
                                    className="input pl-10 w-full"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                        </form>

                        {/* Filter Toggle & View Mode */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`btn-outline inline-flex items-center gap-2 ${showFilters ? 'bg-gray-100' : ''}`}
                            >
                                <HiFilter className="w-5 h-5" />
                                Filter
                            </button>

                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <HiViewGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <HiViewList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="label">Status</label>
                                <select
                                    className="input"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="TERSEDIA">Tersedia</option>
                                    <option value="TERISI">Terisi</option>
                                    <option value="PERBAIKAN">Dalam Perbaikan</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Kategori</label>
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
                            <div className="flex items-end">
                                <button
                                    onClick={() => setFilters({ search: '', status: '', kategoriId: '', page: 1, limit: 12 })}
                                    className="btn-outline w-full"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                </div>
            ) : kamar.length === 0 ? (
                /* Empty State */
                <div className="card">
                    <div className="card-body text-center py-12">
                        <HiOfficeBuilding className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kamar ditemukan</h3>
                        <p className="text-gray-500 mb-4">
                            {filters.search || filters.status || filters.kategoriId
                                ? 'Coba ubah filter pencarian Anda'
                                : 'Belum ada kamar yang terdaftar'}
                        </p>
                        {isPemilik && (
                            <Link to="/kamar/new" className="btn-primary inline-flex items-center gap-2">
                                <HiPlus className="w-5 h-5" />
                                Tambah Kamar Pertama
                            </Link>
                        )}
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {kamar.map((room) => (
                        <Link
                            key={room.id}
                            to={`/kamar/${room.id}`}
                            className="card group hover:shadow-lg transition-shadow"
                        >
                            {/* Room Image */}
                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-xl">
                                {room.fotoKamar?.[0]?.foto ? (
                                    <img
                                        src={room.fotoKamar[0].foto}
                                        alt={room.namaKamar}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <HiOfficeBuilding className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                                {/* Status Badge */}
                                <span className={`absolute top-3 right-3 badge ${getStatusBadgeClass(room.status)}`}>
                                    {KAMAR_STATUS_LABELS[room.status]}
                                </span>
                            </div>

                            {/* Room Info */}
                            <div className="card-body">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                        {room.namaKamar}
                                    </h3>
                                    {room.nomorKamar && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {room.nomorKamar}
                                        </span>
                                    )}
                                </div>

                                {room.kategori && (
                                    <p className="text-sm text-gray-500 mb-2">{room.kategori.namaKategori}</p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    {room.luasKamar && (
                                        <span className="flex items-center gap-1">
                                            <HiLocationMarker className="w-4 h-4" />
                                            {room.luasKamar} m²
                                        </span>
                                    )}
                                    {room.lantai && (
                                        <span>Lt. {room.lantai}</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-primary-600 font-semibold">
                                        <HiCurrencyDollar className="w-5 h-5" />
                                        {formatRupiah(room.hargaPerBulan)}/bln
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kamar</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kategori</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Luas</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Harga/Bulan</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {kamar.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {room.fotoKamar?.[0]?.foto ? (
                                                        <img
                                                            src={room.fotoKamar[0].foto}
                                                            alt={room.namaKamar}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <HiOfficeBuilding className="w-6 h-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{room.namaKamar}</p>
                                                    {room.nomorKamar && (
                                                        <p className="text-sm text-gray-500">{room.nomorKamar}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {room.kategori?.namaKategori || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {room.luasKamar ? `${room.luasKamar} m²` : '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {formatRupiah(room.hargaPerBulan)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${getStatusBadgeClass(room.status)}`}>
                                                {KAMAR_STATUS_LABELS[room.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                to={`/kamar/${room.id}`}
                                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                            >
                                                Detail
                                            </Link>
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
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} kamar
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                            className="btn-outline p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(meta.totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 ||
                                page === meta.totalPages ||
                                (page >= meta.page - 1 && page <= meta.page + 1)
                            ) {
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
                            }
                            if (page === meta.page - 2 || page === meta.page + 2) {
                                return <span key={page} className="px-2 text-gray-400">...</span>;
                            }
                            return null;
                        })}

                        <button
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page === meta.totalPages}
                            className="btn-outline p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KamarList;
