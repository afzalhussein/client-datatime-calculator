import React, { useState } from 'react';
import { useDateTimeOperations, useDateTimeDifference } from '../hooks';
import { Button, ButtonGroup, Box } from '@mui/material';
import DateTimeOperationForm from './DateTimeOperationForm';
import DateTimeDifferenceForm from './DateTimeDifferenceForm';
import ResultDisplay from './ResultDisplay';
import { DateTimeResult } from '../types/datetime';

const DateTimeCalculator = () => {
    const [mode, setMode] = useState<'operation' | 'difference'>('operation');

    const {
        executeOperation,
        result: operationResult,
        loading: operationLoading,
        error: operationError,
        reset: resetOperation
    } = useDateTimeOperations();

    const {
        executeDifference,
        result: differenceResult,
        loading: differenceLoading,
        error: differenceError,
        reset: resetDifference
    } = useDateTimeDifference();

    const handleModeChange = (newMode: 'operation' | 'difference') => {
        setMode(newMode);
        resetOperation();
        resetDifference();
    };

    const currentResult: DateTimeResult | null = mode === 'operation'
        ? operationResult
        : differenceResult;

    const currentError = mode === 'operation' ? operationError : differenceError;
    const currentLoading = mode === 'operation' ? operationLoading : differenceLoading;

    // Prepare result data for display
    const displayResult: DateTimeResult | null = currentError
        ? { error: currentError, result: undefined } // Ensure all required fields are present
        : currentResult;

    return (
        <Box
            sx={{
                opacity: currentLoading ? 0.7 : 1,
                pointerEvents: currentLoading ? 'none' : 'auto',
                maxWidth: '600px',
                margin: '0 auto',
                p: 2
            }}
        >
            <ButtonGroup fullWidth sx={{ mb: 3 }}>
                <Button
                    variant={mode === 'operation' ? 'contained' : 'outlined'}
                    onClick={() => handleModeChange('operation')}
                    disabled={currentLoading}
                >
                    Date/Time Operation
                </Button>
                <Button
                    variant={mode === 'difference' ? 'contained' : 'outlined'}
                    onClick={() => handleModeChange('difference')}
                    disabled={currentLoading}
                >
                    Date/Time Difference
                </Button>
            </ButtonGroup>

            {mode === 'operation' ? (
                <DateTimeOperationForm
                    onSubmit={executeOperation}
                    loading={operationLoading}
                />
            ) : (
                <DateTimeDifferenceForm
                    onSubmit={executeDifference}
                    loading={differenceLoading}
                />
            )}

            {displayResult && (
                <ResultDisplay
                    result={displayResult}
                />
            )}
        </Box>
    );
};

export default DateTimeCalculator;