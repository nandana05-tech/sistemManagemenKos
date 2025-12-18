import { forwardRef } from 'react';
import { HiCheck } from 'react-icons/hi';

const Checkbox = forwardRef(({
    label,
    error,
    helperText,
    className = '',
    disabled = false,
    size = 'md',
    ...props
}, ref) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const labelSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className={className}>
            <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        disabled={disabled}
                        className="peer sr-only"
                        {...props}
                    />
                    <div className={`
            ${sizeClasses[size] || sizeClasses.md}
            rounded border-2 bg-white transition-all duration-200
            peer-checked:bg-primary-600 peer-checked:border-primary-600
            peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}>
                        <HiCheck className={`
              ${sizeClasses[size] || sizeClasses.md} p-0.5
              text-white opacity-0 peer-checked:opacity-100 transition-opacity
            `} />
                    </div>
                </div>
                {label && (
                    <span className={`${labelSizeClasses[size] || labelSizeClasses.md} text-gray-700`}>
                        {label}
                    </span>
                )}
            </label>
            {error && <p className="mt-1.5 text-sm text-red-500 ml-8">{error}</p>}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500 ml-8">{helperText}</p>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
