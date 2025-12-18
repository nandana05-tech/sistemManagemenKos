import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../features/auth/authStore';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            toast.success('Login berhasil!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Login gagal');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Masuk ke Akun Anda
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
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
                    {errors.email && (
                        <p className="error-message">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="label">Password</label>
                    <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                            placeholder="Masukkan password"
                            {...register('password', {
                                required: 'Password wajib diisi',
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <HiEyeOff className="w-5 h-5" />
                            ) : (
                                <HiEye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="error-message">{errors.password.message}</p>
                    )}
                </div>

                {/* Forgot password link */}
                <div className="text-right">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-primary-600 hover:text-primary-700"
                    >
                        Lupa password?
                    </Link>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="spinner"></span>
                            Memproses...
                        </span>
                    ) : (
                        'Masuk'
                    )}
                </button>
            </form>

            {/* Register link */}
            <p className="text-center text-gray-600 mt-6">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Daftar sekarang
                </Link>
            </p>
        </div>
    );
};

export default Login;
