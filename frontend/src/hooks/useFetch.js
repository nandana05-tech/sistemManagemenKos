import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 */
export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isLoading, error, execute, clearError };
};

export default useFetch;
