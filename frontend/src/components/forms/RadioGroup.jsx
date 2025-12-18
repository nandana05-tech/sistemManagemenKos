import { forwardRef } from 'react';

const RadioGroup = forwardRef(({
    label,
    error,
    helperText,
    options = [],
    className = '',
    disabled = false,
    orientation = 'vertical',
    name,
    value,
    onChange,
    ...props
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className={`
        flex gap-4
        ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
      `}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`
              inline-flex items-center gap-3 cursor-pointer
              ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <div className="relative">
                            <input
                                ref={ref}
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={(e) => onChange?.(e.target.value)}
                                disabled={disabled || option.disabled}
                                className="peer sr-only"
                                {...props}
                            />
                            <div className={`
                w-5 h-5 rounded-full border-2 bg-white transition-all duration-200
                peer-checked:border-primary-600 peer-checked:border-[6px]
                peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2
                ${error ? 'border-red-500' : 'border-gray-300'}
              `} />
                        </div>
                        <div>
                            <span className="text-gray-700">{option.label}</span>
                            {option.description && (
                                <p className="text-sm text-gray-500">{option.description}</p>
                            )}
                        </div>
                    </label>
                ))}
            </div>
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
