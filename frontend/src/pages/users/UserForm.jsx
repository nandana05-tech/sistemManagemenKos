import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../../features/users/userStore';
import toast from 'react-hot-toast';
import {
    HiArrowLeft,
    HiSave,
    HiUser,
    HiMail,
    HiPhone,
    HiLockClosed,
    HiEye,
    HiEyeOff
} from 'react-icons/hi';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const {
        selectedUser,
        isLoading,
        fetchUserById,
        createUser,
        updateUser
    } = useUserStore();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    useEffect(() => {
        if (isEdit) {
            fetchUserById(id);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit && selectedUser) {
            reset({
                name: selectedUser.name || '',
                email: selectedUser.email || '',
                noTelepon: selectedUser.noTelepon || '',
                role: selectedUser.role || 'PENGHUNI',
                isActive: selectedUser.isActive ?? true,
            });
        }
    }, [selectedUser, isEdit, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Remove empty password fields for edit
            const submitData = {
                ...data,
                // Convert isActive to boolean (HTML select returns string)
                isActive: data.isActive === 'true' || data.isActive === true
            };
            if (isEdit && !submitData.password) {
                delete submitData.password;
                delete submitData.confirmPassword;
            }
            delete submitData.confirmPassword;

            if (isEdit) {
                await updateUser(parseInt(id), submitData);
                toast.success('Pengguna berhasil diupdate');
            } else {
                await createUser(submitData);
                toast.success('Pengguna berhasil dibuat');
            }

            navigate('/users');
        } catch (error) {
            toast.error(error.message || 'Gagal menyimpan pengguna');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEdit && isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Back Button */}
            <Link to="/users" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <HiArrowLeft className="w-5 h-5" />
                Kembali ke Daftar Pengguna
            </Link>

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="page-title">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h1>
                <p className="page-description">
                    {isEdit ? 'Perbarui informasi pengguna' : 'Isi form berikut untuk menambah pengguna baru'}
                </p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Basic Information */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">Informasi Dasar</h3>
                        </div>
                        <div className="card-body space-y-4">
                            {/* Name */}
                            <div>
                                <label className="label">Nama Lengkap *</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                                        placeholder="Nama lengkap"
                                        {...register('name', { required: 'Nama wajib diisi' })}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="error-message">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="label">Email *</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                                        placeholder="email@example.com"
                                        {...register('email', {
                                            required: 'Email wajib diisi',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Format email tidak valid'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="error-message">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="label">Nomor Telepon</label>
                                <div className="relative">
                                    <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        className="input pl-10"
                                        placeholder="08xxxxxxxxx"
                                        {...register('noTelepon')}
                                    />
                                </div>
                            </div>

                            {/* Role & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Role *</label>
                                    <select
                                        className={`input ${errors.role ? 'input-error' : ''}`}
                                        {...register('role', { required: 'Role wajib dipilih' })}
                                    >
                                        <option value="PENGHUNI">Penghuni</option>
                                        <option value="PEMILIK">Pemilik</option>
                                    </select>
                                    {errors.role && (
                                        <p className="error-message">{errors.role.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="label">Status</label>
                                    <select className="input" {...register('isActive')}>
                                        <option value={true}>Aktif</option>
                                        <option value={false}>Nonaktif</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="card mb-6">
                        <div className="card-header">
                            <h3 className="font-semibold text-gray-900">
                                {isEdit ? 'Ubah Password (Opsional)' : 'Password'}
                            </h3>
                        </div>
                        <div className="card-body space-y-4">
                            {isEdit && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Kosongkan jika tidak ingin mengubah password
                                </p>
                            )}

                            {/* Password */}
                            <div>
                                <label className="label">Password {!isEdit && '*'}</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                        {...register('password', {
                                            required: !isEdit && 'Password wajib diisi',
                                            minLength: {
                                                value: 6,
                                                message: 'Password minimal 6 karakter'
                                            }
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
                                {errors.password && (
                                    <p className="error-message">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="label">Konfirmasi Password {!isEdit && '*'}</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                        {...register('confirmPassword', {
                                            required: !isEdit && password && 'Konfirmasi password wajib diisi',
                                            validate: value => {
                                                if (password && value !== password) {
                                                    return 'Password tidak cocok';
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="error-message">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <Link to="/users" className="btn-outline flex-1 text-center">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <HiSave className="w-5 h-5" />
                                    {isEdit ? 'Update Pengguna' : 'Simpan Pengguna'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
