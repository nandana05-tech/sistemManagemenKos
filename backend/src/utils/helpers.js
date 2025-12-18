const crypto = require('crypto');

/**
 * Generate random token
 * @param {number} length - Token length (default 32)
 * @returns {string} - Random hex token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate unique code with prefix
 * @param {string} prefix - Code prefix (e.g., 'INV', 'PAY', 'SEW')
 * @returns {string} - Generated code
 */
const generateCode = (prefix = 'CODE') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Exclude fields from object
 * @param {object} obj - Source object
 * @param {string[]} keys - Keys to exclude
 * @returns {object} - Object without excluded keys
 */
const exclude = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
};

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate date difference in days
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} - Difference in days
 */
const dateDiffInDays = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate months between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} - Number of months
 */
const monthsBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
};

/**
 * Check if date is past due
 * @param {Date} dueDate - Due date
 * @returns {boolean} - True if past due
 */
const isPastDue = (dueDate) => {
  return new Date() > new Date(dueDate);
};

/**
 * Slugify string
 * @param {string} str - String to slugify
 * @returns {string} - Slugified string
 */
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

module.exports = {
  generateToken,
  generateCode,
  exclude,
  formatRupiah,
  dateDiffInDays,
  monthsBetween,
  isPastDue,
  slugify
};
