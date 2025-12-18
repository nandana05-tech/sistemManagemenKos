import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Loading component
const Loading = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="spinner w-8 h-8"></div>
    </div>
);

// Lazy load pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));

// Kamar pages
const KamarList = lazy(() => import('../pages/kamar/KamarList'));
const KamarDetail = lazy(() => import('../pages/kamar/KamarDetail'));
const KamarForm = lazy(() => import('../pages/kamar/KamarForm'));

// User pages (Pemilik only)
const UserList = lazy(() => import('../pages/users/UserList'));
const UserForm = lazy(() => import('../pages/users/UserForm'));

// Barang/Inventori pages
const BarangList = lazy(() => import('../pages/barang/BarangList'));
const BarangForm = lazy(() => import('../pages/barang/BarangForm'));

// Tagihan pages
const TagihanList = lazy(() => import('../pages/tagihan/TagihanList'));
const TagihanDetail = lazy(() => import('../pages/tagihan/TagihanDetail'));
const TagihanForm = lazy(() => import('../pages/tagihan/TagihanForm'));

// Payment pages
const PaymentList = lazy(() => import('../pages/payment/PaymentList'));
const PaymentDetail = lazy(() => import('../pages/payment/PaymentDetail'));
const PaymentFinish = lazy(() => import('../pages/payment/PaymentFinish'));

// Laporan pages
const LaporanList = lazy(() => import('../pages/laporan/LaporanList'));
const LaporanDetail = lazy(() => import('../pages/laporan/LaporanDetail'));
const LaporanForm = lazy(() => import('../pages/laporan/LaporanForm'));

// Not Found
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>

                {/* Protected routes */}
                <Route
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Kamar */}
                    <Route path="/kamar" element={<KamarList />} />
                    <Route
                        path="/kamar/new"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <KamarForm />
                            </RoleRoute>
                        }
                    />
                    <Route path="/kamar/:id" element={<KamarDetail />} />
                    <Route
                        path="/kamar/:id/edit"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <KamarForm />
                            </RoleRoute>
                        }
                    />

                    {/* Users (Pemilik only) */}
                    <Route
                        path="/users"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <UserList />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/users/new"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <UserForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/users/:id/edit"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <UserForm />
                            </RoleRoute>
                        }
                    />

                    {/* Barang/Inventori */}
                    <Route path="/barang" element={<BarangList />} />
                    <Route
                        path="/barang/new"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <BarangForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/barang/:id/edit"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <BarangForm />
                            </RoleRoute>
                        }
                    />

                    {/* Tagihan */}
                    <Route path="/tagihan" element={<TagihanList />} />
                    <Route
                        path="/tagihan/new"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <TagihanForm />
                            </RoleRoute>
                        }
                    />
                    <Route path="/tagihan/:id" element={<TagihanDetail />} />
                    <Route
                        path="/tagihan/:id/edit"
                        element={
                            <RoleRoute allowedRoles={['PEMILIK']}>
                                <TagihanForm />
                            </RoleRoute>
                        }
                    />

                    {/* Payment */}
                    <Route path="/payment" element={<PaymentList />} />
                    <Route path="/payment/finish" element={<PaymentFinish />} />
                    <Route path="/payment/:id" element={<PaymentDetail />} />

                    {/* Laporan */}
                    <Route path="/laporan" element={<LaporanList />} />
                    <Route path="/laporan/new" element={<LaporanForm />} />
                    <Route path="/laporan/:id" element={<LaporanDetail />} />
                    <Route path="/laporan/:id/edit" element={<LaporanForm />} />
                </Route>

                {/* Redirect root to dashboard or login */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
