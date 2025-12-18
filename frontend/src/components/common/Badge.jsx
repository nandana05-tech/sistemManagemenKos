const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
};

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
};

const Badge = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    dot = false,
    icon,
    removable = false,
    onRemove,
}) => {
    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;

    return (
        <span
            className={`inline-flex items-center gap-1 font-medium rounded-full ${variantClasses} ${sizeClasses} ${className}`}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-green-500' :
                        variant === 'warning' ? 'bg-yellow-500' :
                            variant === 'danger' ? 'bg-red-500' :
                                variant === 'info' ? 'bg-blue-500' :
                                    'bg-primary-500'
                    }`} />
            )}
            {icon && <span className="-ml-0.5">{icon}</span>}
            {children}
            {removable && onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-1 -mr-1 hover:bg-black/10 rounded-full p-0.5"
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </span>
    );
};

export default Badge;
