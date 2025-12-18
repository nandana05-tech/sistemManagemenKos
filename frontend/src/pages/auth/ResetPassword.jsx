import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        if (!token) {
            toast.error('Token tidak valid');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(token, data.password, data.confirmPassword);
            setIsSuccess(true);
            toast.success('Password berhasil direset');
        } catch (error) {
            toast.error(error.message || 'Gagal reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Tidak Valid</h2>
                <p className="text-gray-600 mb-6">Link reset password tidak valid atau sudah kadaluarsa.</p>
                <Link to="/forgot-password" className="btn-primary">
                    Minta Link Baru
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Berhasil Direset</h2>
                <p className="text-gray-600 mb-6">Silakan login dengan password baru Anda.</p>
                <Link to="/login" className="btn-primary">
                    Login Sekarang
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="label">Password Baru</label>
                    <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                            placeholder="Minimal 6 karakter"
                            {...register('password', {
                                required: 'Password wajib diisi',
                                minLength: { value: 6, message: 'Password minimal 6 karakter' },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="label">Konfirmasi Password</label>
                    <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="Ulangi password"
                            {...register('confirmPassword', {
                                required: 'Konfirmasi password wajib diisi',
                                validate: (value) => value === password || 'Password tidak cocok',
                            })}
                        />
                    </div>
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="spinner"></span>
                            Memproses...
                        </span>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
