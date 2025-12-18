import { forwardRef } from 'react';

const Textarea = forwardRef(({
    label,
    error,
    helperText,
    className = '',
    textareaClassName = '',
    required = false,
    disabled = false,
    rows = 4,
    maxLength,
    showCount = false,
    value,
    ...props
}, ref) => {
    const baseTextareaClasses = `
    w-full rounded-lg border bg-white px-4 py-2.5 resize-vertical
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    transition-colors duration-200
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
    ${textareaClassName}
  `;

    const currentLength = value?.length || 0;

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                value={value}
                className={baseTextareaClasses}
                {...props}
            />
            <div className="flex justify-between mt-1.5">
                <div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {helperText && !error && (
                        <p className="text-sm text-gray-500">{helperText}</p>
                    )}
                </div>
                {showCount && maxLength && (
                    <p className={`text-sm ${currentLength >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
                        {currentLength}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
