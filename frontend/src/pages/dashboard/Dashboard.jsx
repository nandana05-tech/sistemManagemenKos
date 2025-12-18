import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import { useTagihanStore } from '../../features/tagihan/tagihanStore';
import { useLaporanStore } from '../../features/laporan/laporanStore';
import { useKamarStore } from '../../features/kamar/kamarStore';
import { useUserStore } from '../../features/users/userStore';
import { formatRupiah, formatDate } from '../../utils/helpers';
import { kamarService } from '../../services/kamar.service';
import { userService } from '../../services/user.service';
import {
    HiOfficeBuilding,
    HiUsers,
    HiCash,
    HiDocumentText,
    HiExclamation,
    HiCheck,
    HiClock,
    HiArrowRight,
    HiCalendar,
    HiCube
} from 'react-icons/hi';

const Dashboard = () => {
    const { user } = useAuthStore();
    const { summary: tagihanSummary, fetchSummary: fetchTagihanSummary, tagihan, fetchTagihan } = useTagihanStore();
    const { summary: laporanSummary, fetchSummary: fetchLaporanSummary, laporan, fetchLaporan } = useLaporanStore();

    const isPemilik = user?.role === 'PEMILIK';

    const [kamarStats, setKamarStats] = useState({ total: 0, tersedia: 0, terisi: 0, perbaikan: 0 });
    const [userStats, setUserStats] = useState({ total: 0, aktif: 0, nonaktif: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch tagihan summary
                await fetchTagihanSummary();

                // Fetch recent tagihan
                await fetchTagihan({ limit: 5 });

                // Fetch laporan data
                if (isPemilik) {
                    await fetchLaporanSummary();
                    await fetchLaporan({ limit: 5 });
                } else {
                    await fetchLaporan({ limit: 5 });
                }

                // Fetch kamar stats
                try {
                    const kamarResponse = await kamarService.getAll({ limit: 1000 });
                    const kamars = kamarResponse.data || [];
                    setKamarStats({
                        total: kamars.length,
                        tersedia: kamars.filter(k => k.status === 'TERSEDIA').length,
                        terisi: kamars.filter(k => k.status === 'TERISI').length,
                        perbaikan: kamars.filter(k => k.status === 'PERBAIKAN').length,
                    });
                } catch (e) {
                    console.error('Error fetching kamar:', e);
                }

                // Fetch user stats (Pemilik only)
                if (isPemilik) {
                    try {
                        const userResponse = await userService.getAll({ limit: 1000, role: 'PENGHUNI' });
                        const users = userResponse.data || [];
                        setUserStats({
                            total: users.length,
                            aktif: users.filter(u => u.isActive).length,
                            nonaktif: users.filter(u => !u.isActive).length,
                        });
                    } catch (e) {
                        console.error('Error fetching users:', e);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isPemilik]);

    const stats = [
        {
            name: 'Total Kamar',
            value: kamarStats.total,
            icon: HiOfficeBuilding,
            color: 'bg-blue-500',
            description: `${kamarStats.terisi} terisi, ${kamarStats.tersedia} tersedia`,
            link: '/kamar'
        },
        ...(isPemilik
            ? [
                {
                    name: 'Total Penghuni',
                    value: userStats.total,
                    icon: HiUsers,
                    color: 'bg-green-500',
                    description: `${userStats.aktif} aktif, ${userStats.nonaktif} non-aktif`,
                    link: '/users'
                },
            ]
            : []),
        {
            name: 'Tagihan Belum Lunas',
            value: tagihanSummary?.belumLunas || 0,
            icon: HiCash,
            color: 'bg-yellow-500',
            description: tagihanSummary?.jatuhTempo > 0
                ? `${tagihanSummary.jatuhTempo} jatuh tempo`
                : 'Tidak ada jatuh tempo',
            link: '/tagihan'
        },
        {
            name: isPemilik ? 'Laporan Masuk' : 'Laporan Saya',
            value: isPemilik
                ? (laporanSummary?.diajukan || 0)
                : (laporan?.length || 0),
            icon: HiDocumentText,
            color: 'bg-purple-500',
            description: isPemilik
                ? `${laporanSummary?.diproses || 0} sedang diproses`
                : `${laporan?.filter(l => l.status === 'DIPROSES').length || 0} diproses`,
            link: '/laporan'
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">
                    Selamat datang kembali, {user?.name}! 👋
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link to={stat.link} key={stat.name} className="card hover:shadow-lg transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.name}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                                    </div>
                                    <div
                                        className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tagihan status */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Status Tagihan</h3>
                        <Link to="/tagihan" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Lihat semua <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="card-body">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <HiClock className="w-5 h-5 text-yellow-600" />
                                    <span className="text-gray-700">Belum Lunas</span>
                                </div>
                                <span className="badge badge-warning">{tagihanSummary?.belumLunas || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <HiCheck className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">Lunas</span>
                                </div>
                                <span className="badge badge-success">{tagihanSummary?.lunas || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <HiExclamation className="w-5 h-5 text-red-600" />
                                    <span className="text-gray-700">Jatuh Tempo</span>
                                </div>
                                <span className="badge badge-danger">{tagihanSummary?.jatuhTempo || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Tagihan */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Tagihan Terbaru</h3>
                        <Link to="/tagihan" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Lihat semua <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="card-body">
                        {tagihan.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Belum ada tagihan</p>
                        ) : (
                            <div className="space-y-3">
                                {tagihan.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.status === 'LUNAS' ? 'bg-green-500' :
                                                    item.status === 'JATUH_TEMPO' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.nomorTagihan}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.riwayatSewa?.kamar?.namaKamar || item.user?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatRupiah(item.nominal)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(item.tanggalJatuhTempo)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Laporan */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                            {isPemilik ? 'Laporan Terbaru' : 'Laporan Saya'}
                        </h3>
                        <Link to="/laporan" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Lihat semua <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="card-body">
                        {laporan.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-gray-500 mb-2">Belum ada laporan</p>
                                {!isPemilik && (
                                    <Link to="/laporan/new" className="text-primary-600 text-sm">
                                        + Buat laporan kerusakan
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {laporan.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.prioritas === 'URGENT' ? 'bg-red-100' :
                                                    item.prioritas === 'TINGGI' ? 'bg-orange-100' : 'bg-blue-100'
                                                }`}>
                                                <HiExclamation className={`w-4 h-4 ${item.prioritas === 'URGENT' ? 'text-red-600' :
                                                        item.prioritas === 'TINGGI' ? 'text-orange-600' : 'text-blue-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {item.judul}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.kamar?.namaKamar || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`badge ${item.status === 'SELESAI' ? 'badge-success' :
                                                item.status === 'DIPROSES' ? 'badge-warning' :
                                                    item.status === 'DITOLAK' ? 'badge-danger' : 'badge-info'
                                            }`}>
                                            {item.status === 'DIAJUKAN' ? 'Baru' :
                                                item.status === 'DIPROSES' ? 'Proses' :
                                                    item.status === 'SELESAI' ? 'Selesai' : 'Ditolak'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="font-semibold text-gray-900">Aksi Cepat</h3>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-3">
                            {isPemilik ? (
                                <>
                                    <Link to="/kamar/new" className="btn-outline text-center">
                                        + Tambah Kamar
                                    </Link>
                                    <Link to="/users/new" className="btn-outline text-center">
                                        + Tambah Penghuni
                                    </Link>
                                    <Link to="/tagihan/new" className="btn-outline text-center">
                                        + Buat Tagihan
                                    </Link>
                                    <Link to="/barang/new" className="btn-outline text-center">
                                        + Tambah Barang
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/tagihan" className="btn-outline text-center">
                                        Lihat Tagihan
                                    </Link>
                                    <Link to="/payment" className="btn-outline text-center">
                                        Riwayat Bayar
                                    </Link>
                                    <Link to="/laporan/new" className="btn-primary text-center">
                                        + Buat Laporan
                                    </Link>
                                    <Link to="/kamar" className="btn-outline text-center">
                                        Info Kamar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
