import { forwardRef } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const Select = forwardRef(({
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Pilih opsi',
    className = '',
    selectClassName = '',
    required = false,
    disabled = false,
    size = 'md',
    ...props
}, ref) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5',
        lg: 'px-4 py-3 text-lg',
    };

    const baseSelectClasses = `
    w-full rounded-lg border bg-white appearance-none
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    transition-colors duration-200 pr-10
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
    ${sizeClasses[size] || sizeClasses.md}
    ${selectClassName}
  `;

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    disabled={disabled}
                    className={baseSelectClasses}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <HiChevronDown className="w-5 h-5" />
                </div>
            </div>
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
