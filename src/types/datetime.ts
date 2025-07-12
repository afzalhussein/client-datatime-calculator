export interface DateTimeOperation {
    date: string;
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    operation: 'add' | 'subtract';
    timezone?: string;
}

export interface DateTimeDifference {
    date1: string;
    date2: string;
    unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';
    timezone1?: string;
    timezone2?: string;
}

export interface ApiResponse {
    result?: string | number;  // Made optional with ?
    unit?: string;
    timezone?: string;
    operation?: string;
    is_negative?: boolean;
    error?: string;
}

export type DateTimeResult = {
    result?: string | number;
    unit?: string;
    timezone?: string;
    operation?: string;
    is_negative?: boolean;
    error?: string;
    errorDetails?: string; 
};