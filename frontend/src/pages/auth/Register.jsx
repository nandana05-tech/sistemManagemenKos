import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../features/auth/authStore';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';

const Register = () => {
    const navigate = useNavigate();
    const { register: registerUser, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                noTelepon: data.noTelepon,
            });
            toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Registrasi gagal');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Buat Akun Baru
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="label">Nama Lengkap</label>
                    <div className="relative">
                        <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                            placeholder="Nama lengkap"
                            {...register('name', {
                                required: 'Nama wajib diisi',
                                minLength: { value: 2, message: 'Nama minimal 2 karakter' },
                            })}
                        />
                    </div>
                    {errors.name && <p className="error-message">{errors.name.message}</p>}
                </div>

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
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="label">No. Telepon (Opsional)</label>
                    <div className="relative">
                        <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="tel"
                            className="input pl-10"
                            placeholder="08xxxxxxxxxx"
                            {...register('noTelepon')}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="label">Password</label>
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
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
                    {errors.confirmPassword && (
                        <p className="error-message">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit button */}
                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="spinner"></span>
                            Memproses...
                        </span>
                    ) : (
                        'Daftar'
                    )}
                </button>
            </form>

            {/* Login link */}
            <p className="text-center text-gray-600 mt-6">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Masuk
                </Link>
            </p>
        </div>
    );
};

export default Register;
