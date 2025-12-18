import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token verifikasi tidak ditemukan');
                return;
            }

            try {
                await authService.verifyEmail(token);
                setStatus('success');
                setMessage('Email berhasil diverifikasi!');
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Gagal memverifikasi email');
            }
        };

        verifyEmail();
    }, [token]);

    if (status === 'loading') {
        return (
            <div className="text-center">
                <div className="spinner w-12 h-12 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900">Memverifikasi email...</h2>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Terverifikasi!</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link to="/login" className="btn-primary">
                    Login Sekarang
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/login" className="btn-primary">
                Kembali ke Login
            </Link>
        </div>
    );
};

export default VerifyEmail;
