import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../features/auth/authStore';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import { getInitials, stringToColor } from '../../utils/helpers';
import { HiUser, HiMail, HiPhone, HiCamera, HiLockClosed } from 'react-icons/hi';

const Profile = () => {
    const { user, updateUserProfile } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            noTelepon: user?.noTelepon || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        watch,
        formState: { errors: passwordErrors },
    } = useForm();

    const newPassword = watch('newPassword');

    const onSubmitProfile = async (data) => {
        setIsLoading(true);
        try {
            const response = await userService.updateProfile(data);
            updateUserProfile(response.data);
            toast.success('Profil berhasil diupdate');
        } catch (error) {
            toast.error(error.message || 'Gagal update profil');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitPassword = async (data) => {
        setIsChangingPassword(true);
        try {
            await authService.changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
            toast.success('Password berhasil diubah');
            resetPassword();
        } catch (error) {
            toast.error(error.message || 'Gagal mengubah password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div>
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title">Profil Saya</h1>
                <p className="page-description">Kelola informasi profil dan keamanan akun Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <div className="card-body text-center">
                            {/* Avatar */}
                            <div className="relative inline-block mb-4">
                                {user?.fotoProfil ? (
                                    <img
                                        src={user.fotoProfil}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full object-cover mx-auto"
                                    />
                                ) : (
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto"
                                        style={{ backgroundColor: stringToColor(user?.name) }}
                                    >
                                        {getInitials(user?.name)}
                                    </div>
                                )}
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700">
                                    <HiCamera className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                            <p className="text-gray-500">{user?.email}</p>
                            <span className={`badge ${user?.role === 'PEMILIK' ? 'badge-primary' : 'badge-success'} mt-2`}>
                                {user?.role === 'PEMILIK' ? 'Pemilik' : 'Penghuni'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Forms */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'profile'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Informasi Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'security'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Keamanan
                        </button>
                    </div>

                    {activeTab === 'profile' && (
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                                    <div>
                                        <label className="label">Nama Lengkap</label>
                                        <div className="relative">
                                            <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                                                {...register('name', { required: 'Nama wajib diisi' })}
                                            />
                                        </div>
                                        {errors.name && <p className="error-message">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="label">Email</label>
                                        <div className="relative">
                                            <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                className="input pl-10 bg-gray-50"
                                                value={user?.email}
                                                disabled
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                                    </div>

                                    <div>
                                        <label className="label">No. Telepon</label>
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

                                    <button type="submit" disabled={isLoading} className="btn-primary">
                                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="font-semibold text-gray-900 mb-4">Ubah Password</h3>
                                <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
                                    <div>
                                        <label className="label">Password Saat Ini</label>
                                        <div className="relative">
                                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="password"
                                                className={`input pl-10 ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                                                {...registerPassword('currentPassword', { required: 'Password saat ini wajib diisi' })}
                                            />
                                        </div>
                                        {passwordErrors.currentPassword && (
                                            <p className="error-message">{passwordErrors.currentPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">Password Baru</label>
                                        <div className="relative">
                                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="password"
                                                className={`input pl-10 ${passwordErrors.newPassword ? 'input-error' : ''}`}
                                                {...registerPassword('newPassword', {
                                                    required: 'Password baru wajib diisi',
                                                    minLength: { value: 6, message: 'Minimal 6 karakter' },
                                                })}
                                            />
                                        </div>
                                        {passwordErrors.newPassword && (
                                            <p className="error-message">{passwordErrors.newPassword.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">Konfirmasi Password</label>
                                        <div className="relative">
                                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="password"
                                                className={`input pl-10 ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                                                {...registerPassword('confirmPassword', {
                                                    required: 'Konfirmasi password wajib diisi',
                                                    validate: (v) => v === newPassword || 'Password tidak cocok',
                                                })}
                                            />
                                        </div>
                                        {passwordErrors.confirmPassword && (
                                            <p className="error-message">{passwordErrors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <button type="submit" disabled={isChangingPassword} className="btn-primary">
                                        {isChangingPassword ? 'Mengubah...' : 'Ubah Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
