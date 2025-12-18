import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { HiMail, HiArrowLeft } from 'react-icons/hi';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(data.email);
            setIsSubmitted(true);
            toast.success('Link reset password telah dikirim ke email Anda');
        } catch (error) {
            toast.error(error.message || 'Gagal mengirim email reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiMail className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cek Email Anda</h2>
                <p className="text-gray-600 mb-6">
                    Kami telah mengirimkan link reset password ke email Anda.
                    Silakan cek inbox atau folder spam.
                </p>
                <Link to="/login" className="btn-primary">
                    Kembali ke Login
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/login" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-4 h-4" />
                Kembali
            </Link>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
            <p className="text-gray-600 mb-6">
                Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="label">Email</label>
                    <div className="relative">
                        <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                            placeholder="nama@email.com"
                            {...register('email', {
                                required: 'Email wajib diisi',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Format email tidak valid',
                                },
                            })}
                        />
                    </div>
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="spinner"></span>
                            Mengirim...
                        </span>
                    ) : (
                        'Kirim Link Reset'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
