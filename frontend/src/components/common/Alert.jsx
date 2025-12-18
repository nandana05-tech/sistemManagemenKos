import { HiInformationCircle, HiCheckCircle, HiExclamation, HiXCircle, HiX } from 'react-icons/hi';

const variants = {
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: HiInformationCircle,
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800',
        textColor: 'text-blue-700',
    },
    success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: HiCheckCircle,
        iconColor: 'text-green-500',
        titleColor: 'text-green-800',
        textColor: 'text-green-700',
    },
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: HiExclamation,
        iconColor: 'text-yellow-500',
        titleColor: 'text-yellow-800',
        textColor: 'text-yellow-700',
    },
    danger: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: HiXCircle,
        iconColor: 'text-red-500',
        titleColor: 'text-red-800',
        textColor: 'text-red-700',
    },
};

const Alert = ({
    variant = 'info',
    title,
    children,
    className = '',
    dismissible = false,
    onDismiss,
    icon: CustomIcon,
}) => {
    const styles = variants[variant] || variants.info;
    const Icon = CustomIcon || styles.icon;

    return (
        <div
            className={`rounded-lg p-4 border ${styles.bg} ${styles.border} ${className}`}
            role="alert"
        >
            <div className="flex">
                <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0`} />
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h3>
                    )}
                    {children && (
                        <div className={`text-sm ${styles.textColor} ${title ? 'mt-1' : ''}`}>
                            {children}
                        </div>
                    )}
                </div>
                {dismissible && onDismiss && (
                    <button
                        onClick={onDismiss}
                        className={`ml-3 -mr-1.5 -mt-1.5 p-1.5 rounded-lg hover:bg-black/5 ${styles.iconColor}`}
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;
