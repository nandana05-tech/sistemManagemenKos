import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentService } from '../../services/payment.service';
import { HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';

const PaymentFinish = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [syncResult, setSyncResult] = useState(null);

    const urlStatus = searchParams.get('transaction_status') || 'pending';
    const orderId = searchParams.get('order_id');

    // Sync payment status on page load
    useEffect(() => {
        const syncPayment = async () => {
            if (!orderId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await paymentService.syncStatus(orderId);
                setSyncResult({
                    success: response.data?.midtransStatus === 'settlement' || response.data?.midtransStatus === 'capture',
                    status: response.data?.midtransStatus || urlStatus,
                    message: response.message
                });
            } catch (error) {
                console.error('Failed to sync payment:', error);
                // Use URL status as fallback
                setSyncResult({
                    success: urlStatus === 'settlement' || urlStatus === 'capture',
                    status: urlStatus,
                    message: null
                });
            } finally {
                setIsLoading(false);
            }
        };

        syncPayment();
    }, [orderId, urlStatus]);

    const status = syncResult?.status || urlStatus;

    const statusConfig = {
        settlement: { icon: HiCheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Pembayaran Berhasil!', desc: 'Terima kasih! Pembayaran Anda telah diterima.' },
        capture: { icon: HiCheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Pembayaran Berhasil!', desc: 'Terima kasih! Pembayaran Anda telah diterima.' },
        pending: { icon: HiClock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Menunggu Pembayaran', desc: 'Silakan selesaikan pembayaran Anda.' },
        deny: { icon: HiXCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Pembayaran Ditolak', desc: 'Maaf, pembayaran Anda ditolak.' },
        cancel: { icon: HiXCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Pembayaran Dibatalkan', desc: 'Pembayaran telah dibatalkan.' },
        expire: { icon: HiXCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Pembayaran Kadaluarsa', desc: 'Batas waktu pembayaran telah berakhir.' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="card max-w-md w-full">
                    <div className="card-body text-center py-8">
                        <div className="spinner w-12 h-12 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Memproses pembayaran...</h2>
                        <p className="text-gray-500">Mohon tunggu sebentar</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
                <div className="card-body text-center py-8">
                    <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-10 h-10 ${config.color}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.text}</h2>
                    <p className="text-gray-600 mb-2">{config.desc}</p>
                    {orderId && <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>}
                    <div className="flex flex-col gap-3">
                        <Link to="/tagihan" className="btn-primary">
                            Lihat Tagihan
                        </Link>
                        <Link to="/payment" className="btn-outline">
                            Riwayat Pembayaran
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFinish;
