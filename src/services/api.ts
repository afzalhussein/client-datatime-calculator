import axios, { AxiosError } from 'axios';
import { DateTimeOperation, DateTimeDifference, ApiResponse } from '../types/datetime';

const API_BASE_URL = 'http://localhost:8000';

const handleApiError = (error: unknown): ApiResponse => {
    let errorMessage = 'Unknown error occurred';

    if (error instanceof Error) {
        errorMessage = error.message;
    }

    if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
    }

    return {
        result: undefined,
        error: errorMessage
    };
};

export const performDateTimeOperation = async (
    data: DateTimeOperation
): Promise<ApiResponse> => {
    try {
        const response = await axios.post<ApiResponse>(
            `${API_BASE_URL}/calculate/operation`,
            data
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const calculateDateTimeDifference = async (
    data: DateTimeDifference
): Promise<ApiResponse> => {
    try {
        const response = await axios.post<ApiResponse>(
            `${API_BASE_URL}/calculate/difference`,
            data
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};