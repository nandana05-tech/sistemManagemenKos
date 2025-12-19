import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { kamarService } from '../services/kamar.service';
import { formatRupiah } from '../utils/helpers';
import { KAMAR_STATUS_LABELS, KAMAR_STATUS_COLORS } from '../utils/constants';
import {
    HiOfficeBuilding,
    HiLocationMarker,
    HiCurrencyDollar,
    HiStar,
    HiLogin,
    HiUserAdd,
    HiHome,
    HiChevronRight,
    HiPhone,
    HiMail,
    HiClock
} from 'react-icons/hi';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [kamar, setKamar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchKamar = async () => {
            try {
                const response = await kamarService.getAll({ limit: 6, status: 'TERSEDIA' });
                setKamar(response.data || []);
            } catch (error) {
                console.error('Failed to fetch kamar:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchKamar();
    }, []);

    const getStatusBadgeClass = (status) => {
        const colorMap = {
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger'
        };
        return colorMap[KAMAR_STATUS_COLORS[status]] || 'badge-primary';
    };

    const handleBookRoom = (roomId) => {
        if (isAuthenticated) {
            navigate(`/kamar/${roomId}`);
        } else {
            navigate(`/login?redirect=/kamar/${roomId}`);
        }
    };

    // Smooth scroll to section
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Static testimonials data
    const testimonials = [
        {
            id: 1,
            name: 'Andi',
            role: 'Mahasiswa',
            rating: 5,
            content: 'Tempat kosnya bersih, nyaman, dan pengelolaannya rapi. Pembayaran juga mudah karena sudah sistem online.'
        },
        {
            id: 2,
            name: 'Rina',
            role: 'Karyawan',
            rating: 5,
            content: 'Lingkungan aman dan tenang, cocok untuk istirahat setelah kerja. Pengelola responsif kalau ada kendala.'
        },
        {
            id: 3,
            name: 'Budi',
            role: 'Penghuni',
            rating: 5,
            content: 'Fasilitas lengkap dan kamar sesuai dengan deskripsi. Tinggal di Kos Wisnu jadi lebih praktis dan nyaman.'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Header/Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                                <HiHome className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
                                Kos Wisnu
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <button onClick={(e) => scrollToSection(e, 'welcome')} className="text-gray-600 hover:text-primary-600 transition-colors">Beranda</button>
                            <button onClick={(e) => scrollToSection(e, 'kamar')} className="text-gray-600 hover:text-primary-600 transition-colors">Kamar</button>
                            <button onClick={(e) => scrollToSection(e, 'lokasi')} className="text-gray-600 hover:text-primary-600 transition-colors">Lokasi</button>
                            <button onClick={(e) => scrollToSection(e, 'testimoni')} className="text-gray-600 hover:text-primary-600 transition-colors">Testimoni</button>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <Link
                                    to="/dashboard"
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    <HiHome className="w-5 h-5" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn-outline inline-flex items-center gap-2"
                                    >
                                        <HiLogin className="w-5 h-5" />
                                        <span className="hidden sm:inline">Masuk</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary inline-flex items-center gap-2"
                                    >
                                        <HiUserAdd className="w-5 h-5" />
                                        <span className="hidden sm:inline">Daftar</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero/Welcome Section */}
            <section id="welcome" className="relative pt-16 min-h-[80vh] flex items-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                                🏠 Hunian Terbaik untuk Anda
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Selamat Datang di{' '}
                                <span className="text-yellow-300">Kos Wisnu</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                Hunian kos yang nyaman, aman, dan terkelola dengan baik untuk menunjang aktivitas harian Anda.
                            </p>
                            <p className="text-white/80 mb-8 leading-relaxed">
                                Kos Wisnu menyediakan kamar bersih, fasilitas lengkap, serta sistem pengelolaan modern yang memudahkan penghuni dalam pembayaran, informasi kamar, dan layanan lainnya.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={(e) => scrollToSection(e, 'kamar')}
                                    className="btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 transition-all transform hover:scale-105"
                                >
                                    Lihat Kamar Tersedia
                                    <HiChevronRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => scrollToSection(e, 'lokasi')}
                                    className="btn-lg border-2 border-white/50 text-white hover:bg-white/10 font-semibold inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 transition-all"
                                >
                                    <HiLocationMarker className="w-5 h-5" />
                                    Lihat Lokasi
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                                    <HiOfficeBuilding className="w-6 h-6 text-yellow-900" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{kamar.length}+</p>
                                <p className="text-white/80">Kamar Tersedia</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center mb-4">
                                    <HiStar className="w-6 h-6 text-green-900" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">5.0</p>
                                <p className="text-white/80">Rating Penghuni</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    <HiClock className="w-6 h-6 text-blue-900" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">24/7</p>
                                <p className="text-white/80">Akses Penghuni</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center mb-4">
                                    <HiCurrencyDollar className="w-6 h-6 text-purple-900" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">Easy</p>
                                <p className="text-white/80">Pembayaran Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb" />
                    </svg>
                </div>
            </section>

            {/* Kamar Section */}
            <section id="kamar" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                            Pilihan Kamar
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Kamar Tersedia untuk Anda
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Temukan kamar yang sesuai dengan kebutuhan dan budget Anda. Semua kamar dilengkapi fasilitas modern.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="spinner w-8 h-8"></div>
                        </div>
                    ) : kamar.length === 0 ? (
                        <div className="text-center py-12">
                            <HiOfficeBuilding className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada kamar tersedia</h3>
                            <p className="text-gray-500">Silakan kembali lagi nanti</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kamar.map((room) => (
                                <div
                                    key={room.id}
                                    className="group bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Room Image */}
                                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                        {room.fotoKamar?.[0]?.foto ? (
                                            <img
                                                src={room.fotoKamar[0].foto}
                                                alt={room.namaKamar}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Room Info */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                                {room.namaKamar}
                                            </h3>
                                            {room.nomorKamar && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                    {room.nomorKamar}
                                                </span>
                                            )}
                                        </div>

                                        {room.kategori && (
                                            <p className="text-sm text-gray-500 mb-3">{room.kategori.namaKategori}</p>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500">Mulai dari</p>
                                                <p className="text-lg font-bold text-primary-600">
                                                    {formatRupiah(room.hargaPerBulan)}
                                                    <span className="text-sm font-normal text-gray-500">/bln</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleBookRoom(room.id)}
                                                className="btn-primary px-4 py-2 text-sm"
                                            >
                                                Pesan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {kamar.length > 0 && (
                        <div className="text-center mt-10">
                            <button
                                onClick={() => isAuthenticated ? navigate('/kamar') : navigate('/login?redirect=/kamar')}
                                className="btn-outline inline-flex items-center gap-2"
                            >
                                Lihat Semua Kamar
                                <HiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Lokasi Section */}
            <section id="lokasi" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                            Lokasi Strategis
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Temukan Kami
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Lokasi strategis di Karang Gayam, Caturtunggal, Depok, Sleman. Dekat dengan kampus dan pusat kota.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Map */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7525.51670858972!2d110.3827326405251!3d-7.76726478856918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59b0fb511617%3A0xf3810d4cf22e953b!2sKarang%20Gayam%2C%20Caturtunggal%2C%20Depok%2C%20Sleman%20Regency%2C%20Special%20Region%20of%20Yogyakarta!5e1!3m2!1sen!2sid!4v1766135848399!5m2!1sen!2sid"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Kos Wisnu"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
                                    <HiLocationMarker className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Alamat</h3>
                                <p className="text-gray-600">
                                    Karang Gayam, Caturtunggal,<br />
                                    Depok, Sleman,<br />
                                    D.I. Yogyakarta
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                                    <HiPhone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Hubungi Kami</h3>
                                <p className="text-gray-600">
                                    WhatsApp: +62 812-XXXX-XXXX<br />
                                    Telepon: (0274) XXX-XXX
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                                    <HiClock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Jam Operasional</h3>
                                <p className="text-gray-600">
                                    Senin - Minggu<br />
                                    08:00 - 21:00 WIB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimoni Section */}
            <section id="testimoni" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
                            Testimoni
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Apa Kata Penghuni Kami
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Dengarkan pengalaman langsung dari penghuni yang sudah merasakan kenyamanan tinggal di Kos Wisnu.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <HiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-gray-600 mb-6 italic leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-lg">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Siap Menjadi Penghuni Kos Wisnu?
                    </h2>
                    <p className="text-white/90 text-lg mb-8">
                        Daftar sekarang dan nikmati kemudahan pemesanan serta pembayaran online.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <Link
                                to="/kamar"
                                className="btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 transition-all"
                            >
                                Pesan Kamar Sekarang
                                <HiChevronRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 transition-all"
                                >
                                    <HiUserAdd className="w-5 h-5" />
                                    Daftar Sekarang
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-lg border-2 border-white text-white hover:bg-white/10 font-semibold inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 transition-all"
                                >
                                    <HiLogin className="w-5 h-5" />
                                    Sudah Punya Akun
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                    <HiHome className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">Kos Wisnu</span>
                            </div>
                            <p className="text-gray-400 mb-4 max-w-md">
                                Hunian kos yang nyaman, aman, dan terkelola dengan baik untuk menunjang aktivitas harian Anda.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><button onClick={(e) => scrollToSection(e, 'welcome')} className="hover:text-white transition-colors">Beranda</button></li>
                                <li><button onClick={(e) => scrollToSection(e, 'kamar')} className="hover:text-white transition-colors">Kamar</button></li>
                                <li><button onClick={(e) => scrollToSection(e, 'lokasi')} className="hover:text-white transition-colors">Lokasi</button></li>
                                <li><button onClick={(e) => scrollToSection(e, 'testimoni')} className="hover:text-white transition-colors">Testimoni</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Kontak</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <HiLocationMarker className="w-4 h-4" />
                                    Karang Gayam, Sleman, DIY
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiPhone className="w-4 h-4" />
                                    +62 812-XXXX-XXXX
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiMail className="w-4 h-4" />
                                    info@koswisnu.com
                                </li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-800 my-8" />

                    <div className="text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} Kos Wisnu. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
