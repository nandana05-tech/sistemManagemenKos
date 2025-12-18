import { HiExclamation, HiQuestionMarkCircle, HiInformationCircle, HiTrash } from 'react-icons/hi';
import Modal from './Modal';
import Button from './Button';

const icons = {
    danger: { icon: HiTrash, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    warning: { icon: HiExclamation, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    info: { icon: HiInformationCircle, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    question: { icon: HiQuestionMarkCircle, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' },
};

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'danger',
    isLoading = false,
}) => {
    const { icon: Icon, bgColor, iconColor } = icons[variant] || icons.question;

    const confirmVariant = {
        danger: 'danger',
        warning: 'warning',
        info: 'primary',
        question: 'primary',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="text-center">
                <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                {message && <p className="text-gray-500 mb-6">{message}</p>}
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmVariant[variant]}
                        className="flex-1"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
