/**
 * Email validation
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation (Indonesian format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Password strength validation
 * Returns: { isValid, strength, message }
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 0,
    message: '',
  };

  if (!password || password.length < 6) {
    result.message = 'Password minimal 6 karakter';
    return result;
  }

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Contains lowercase
  if (/[a-z]/.test(password)) strength++;

  // Contains uppercase
  if (/[A-Z]/.test(password)) strength++;

  // Contains number
  if (/[0-9]/.test(password)) strength++;

  // Contains special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  result.strength = Math.min(strength, 5);
  result.isValid = strength >= 2;

  if (strength <= 1) {
    result.message = 'Password terlalu lemah';
  } else if (strength <= 2) {
    result.message = 'Password lemah';
  } else if (strength <= 3) {
    result.message = 'Password cukup kuat';
  } else if (strength <= 4) {
    result.message = 'Password kuat';
  } else {
    result.message = 'Password sangat kuat';
  }

  return result;
};

/**
 * Required field validation
 */
export const isRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} wajib diisi`;
  }
  return null;
};

/**
 * Min length validation
 */
export const minLength = (value, min, fieldName = 'Field') => {
  if (value && value.length < min) {
    return `${fieldName} minimal ${min} karakter`;
  }
  return null;
};

/**
 * Max length validation
 */
export const maxLength = (value, max, fieldName = 'Field') => {
  if (value && value.length > max) {
    return `${fieldName} maksimal ${max} karakter`;
  }
  return null;
};

/**
 * Number validation
 */
export const isNumber = (value, fieldName = 'Field') => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} harus berupa angka`;
  }
  return null;
};

/**
 * Positive number validation
 */
export const isPositive = (value, fieldName = 'Field') => {
  if (value && Number(value) <= 0) {
    return `${fieldName} harus lebih dari 0`;
  }
  return null;
};

/**
 * Match validation (for confirm password)
 */
export const matches = (value, compareValue, fieldName = 'Field') => {
  if (value !== compareValue) {
    return `${fieldName} tidak cocok`;
  }
  return null;
};

/**
 * File size validation
 */
export const maxFileSize = (file, maxSizeMB = 5) => {
  if (file && file.size > maxSizeMB * 1024 * 1024) {
    return `Ukuran file maksimal ${maxSizeMB}MB`;
  }
  return null;
};

/**
 * File type validation
 */
export const allowedFileTypes = (file, types = ['image/jpeg', 'image/png', 'image/jpg']) => {
  if (file && !types.includes(file.type)) {
    return 'Format file tidak didukung';
  }
  return null;
};
