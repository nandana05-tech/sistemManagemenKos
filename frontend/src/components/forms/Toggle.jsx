import { forwardRef } from 'react';

const Toggle = forwardRef(({
    label,
    description,
    error,
    className = '',
    disabled = false,
    size = 'md',
    ...props
}, ref) => {
    const sizes = {
        sm: { track: 'w-8 h-5', thumb: 'w-4 h-4', translate: 'peer-checked:translate-x-3' },
        md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'peer-checked:translate-x-5' },
        lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'peer-checked:translate-x-7' },
    };

    const { track, thumb, translate } = sizes[size] || sizes.md;

    return (
        <div className={className}>
            <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="relative flex-shrink-0 mt-0.5">
                    <input
                        ref={ref}
                        type="checkbox"
                        disabled={disabled}
                        className="peer sr-only"
                        {...props}
                    />
                    <div className={`
            ${track} rounded-full transition-colors duration-200
            bg-gray-300 peer-checked:bg-primary-600
            peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2
          `} />
                    <div className={`
            absolute left-0.5 top-0.5 ${thumb} rounded-full bg-white shadow-md
            transition-transform duration-200 ${translate}
          `} />
                </div>
                {(label || description) && (
                    <div className="flex-1">
                        {label && (
                            <span className="block font-medium text-gray-700">{label}</span>
                        )}
                        {description && (
                            <span className="block text-sm text-gray-500">{description}</span>
                        )}
                    </div>
                )}
            </label>
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        </div>
    );
});

Toggle.displayName = 'Toggle';

export default Toggle;
