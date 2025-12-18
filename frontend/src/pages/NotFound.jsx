import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mt-4">Halaman Tidak Ditemukan</h2>
                <p className="text-gray-500 mt-2 mb-6">
                    Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
                </p>
                <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                    <HiHome className="w-5 h-5" />
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
