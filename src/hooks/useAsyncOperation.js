import { useState, useCallback } from 'react';

export default function useAsyncOperation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (asyncFunction, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      resetOnStart = true,
      loadingState = true 
    } = options;

    try {
      if (resetOnStart) {
        setError(null);
        setData(null);
      }
      
      if (loadingState) {
        setIsLoading(true);
      }

      const result = await asyncFunction();
      setData(result);
      setError(null);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      setData(null);
      onError?.(err);
      throw err;
    } finally {
      if (loadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
    isSuccess: !isLoading && !error && data !== null,
    isError: !isLoading && error !== null,
    isIdle: !isLoading && !error && data === null
  };
}
