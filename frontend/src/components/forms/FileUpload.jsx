import { useCallback, useState } from 'react';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';

const FileUpload = ({
    label,
    error,
    helperText,
    accept = 'image/*',
    multiple = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    maxFiles = 5,
    onChange,
    value = [],
    preview = true,
    className = '',
    disabled = false,
}) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const validateFiles = (files) => {
        const validFiles = [];
        const errors = [];

        for (const file of files) {
            if (file.size > maxSize) {
                errors.push(`${file.name}: Ukuran file terlalu besar (max ${maxSize / 1024 / 1024}MB)`);
                continue;
            }
            if (validFiles.length + value.length >= maxFiles) {
                errors.push(`Maksimal ${maxFiles} file`);
                break;
            }
            validFiles.push(file);
        }

        return { validFiles, errors };
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        const { validFiles, errors } = validateFiles(files);

        if (errors.length > 0) {
            console.error(errors);
        }

        if (validFiles.length > 0) {
            const newFiles = multiple ? [...value, ...validFiles] : [validFiles[0]];
            onChange?.(newFiles);
        }
    }, [value, multiple, disabled, maxFiles, maxSize, onChange]);

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        const { validFiles, errors } = validateFiles(files);

        if (errors.length > 0) {
            console.error(errors);
        }

        if (validFiles.length > 0) {
            const newFiles = multiple ? [...value, ...validFiles] : [validFiles[0]];
            onChange?.(newFiles);
        }
    };

    const handleRemove = (index) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange?.(newFiles);
    };

    const getPreviewUrl = (file) => {
        if (typeof file === 'string') return file;
        return URL.createObjectURL(file);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}

            <div
                className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400'}
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <HiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                    <span className="text-primary-600 font-medium">Klik untuk upload</span> atau drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {accept.replace('*', 'files')} (max {maxSize / 1024 / 1024}MB)
                </p>
            </div>

            {/* Preview */}
            {preview && value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {value.map((file, index) => (
                        <div key={index} className="relative group">
                            {(typeof file === 'string' ? file : file.type?.startsWith('image/')) ? (
                                <img
                                    src={getPreviewUrl(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                            ) : (
                                <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                    <HiPhotograph className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <HiX className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default FileUpload;
