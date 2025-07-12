import { useState } from 'react';
import { DateTimeOperation, ApiResponse } from '../types/datetime';
import { performDateTimeOperation } from '../services/api';

export const useDateTimeOperations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ApiResponse | null>(null);

    const executeOperation = async (operation: DateTimeOperation) => {
        setLoading(true);
        setError(null);

        try {
            const response = await performDateTimeOperation(operation);

            if (response.error) {
                setError(response.error);
                setResult(null);
            } else {
                setResult(response);
                setError(null);
            }

            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            setResult(null);
            return { error: errorMessage } as ApiResponse;
        } finally {
            setLoading(false);
        }
    };

    return {
        executeOperation,
        result,
        loading,
        error,
        reset: () => {
            setResult(null);
            setError(null);
        }
    };
};