import { useState } from 'react';
import { DateTimeDifference, ApiResponse } from '../types/datetime';
import { calculateDateTimeDifference } from '../services/api';

export const useDateTimeDifference = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ApiResponse | null>(null);

    const executeDifference = async (difference: DateTimeDifference) => {
        setLoading(true);
        setError(null);

        try {
            const response = await calculateDateTimeDifference(difference);

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
        executeDifference,
        result,
        loading,
        error,
        reset: () => {
            setResult(null);
            setError(null);
        }
    };
};