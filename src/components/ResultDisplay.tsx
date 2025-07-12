import React from 'react';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { DateTimeResult } from '../types/datetime';
import { format, isValid } from 'date-fns';

interface ResultDisplayProps {
    result: DateTimeResult | null;
    loading?: boolean;
    'data-testid'?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
    result,
    loading = false,
    'data-testid': testId = 'result-display'
}) => {
    // Loading state takes highest priority
    if (loading) {
        return (
            <Box
                data-testid={`${testId}-loading`}
                sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
                aria-live="polite"
                aria-busy="true"
            >
                <CircularProgress aria-label="Loading results" />
            </Box>
        );
    }

    // Handle null/undefined result
    if (!result) {
        return (
            <div data-testid={`${testId}-null`} aria-live="polite">
                {/* Empty state is intentionally not announced to screen readers */}
            </div>
        );
    }

    // Error case
    if (result.error) {
        return (
            <Box
                data-testid={`${testId}-error`}
                sx={{ mt: 4 }}
                role="alert"
                aria-live="assertive"
            >
                <Alert severity="error" sx={{ mb: 2 }}>
                    <span aria-hidden="false">{result.error}</span>
                </Alert>
                {result.errorDetails && (
                    <Typography variant="body2" color="text.secondary">
                        <span id="error-details">{result.errorDetails}</span>
                    </Typography>
                )}
            </Box>
        );
    }

    // No result case (successful but empty)
    if (!result.result) {
        return (
            <Box
                data-testid={`${testId}-empty`}
                sx={{ mt: 4 }}
                aria-live="polite"
            >
                <Alert severity="info">
                    <span aria-hidden="false">No result to display</span>
                </Alert>
            </Box>
        );
    }

    // Difference calculation case
    if (result.unit) {
        return (
            <Box
                data-testid={`${testId}-difference`}
                sx={{ mt: 4 }}
                aria-live="polite"
            >
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" component="h2">
                        Difference:
                    </Typography>
                    <Typography>
                        {result.result} {result.unit}
                        {result.is_negative && (
                            <span aria-label="negative result"> (negative)</span>
                        )}
                    </Typography>
                </Paper>
            </Box>
        );
    }

    // Date operation case (default case)
    const resultDate = new Date(result.result as string);
    const formattedDate = isValid(resultDate)
        ? format(resultDate, 'PPPPpppp')
        : 'Invalid date format';

    return (
        <Box
            data-testid={`${testId}-operation`}
            sx={{ mt: 4 }}
            aria-live="polite"
        >
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" component="h2">
                    Result:
                </Typography>
                <Typography>
                    <time dateTime={resultDate.toISOString()}>
                        {formattedDate}
                    </time>
                </Typography>
                {result.timezone && (
                    <Typography variant="body2">
                        <span id="timezone-label">Timezone:</span> {result.timezone}
                    </Typography>
                )}
                {result.operation && (
                    <Typography variant="body2">
                        <span id="operation-label">Operation:</span> {result.operation}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default ResultDisplay;