import { useState } from "react";

// Custom hook for managing server functions with loading states
export const useServerFunction = <T,>() => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const execute = async (
      fn: () => Promise<T>,
      successCallback?: (data: T) => void
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fn();
        successCallback?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };
  
    return { isLoading, error, execute };
  };