import React, { useState, useMemo } from 'react';
import { useDateTimeOperations, useDateTimeDifference } from '../hooks';
import { Button, ButtonGroup, Box, CircularProgress, Alert, Fade } from '@mui/material';
import DateTimeOperationForm from './DateTimeOperationForm';
import DateTimeDifferenceForm from './DateTimeDifferenceForm';
import ResultDisplay from './ResultDisplay';
import { DateTimeResult } from '../types/datetime';

const DateTimeCalculator = () => {
    const [mode, setMode] = useState<'operation' | 'difference'>('operation');
    const [showResult, setShowResult] = useState(false);

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
        setShowResult(false);
    };

    const handleReset = () => {
        resetOperation();
        resetDifference();
        setShowResult(false);
    };

    const currentResult = useMemo(() => (
        mode === 'operation' ? operationResult : differenceResult
    ), [mode, operationResult, differenceResult]);

    const currentError = useMemo(() => (
        mode === 'operation' ? operationError : differenceError
    ), [mode, operationError, differenceError]);

    const currentLoading = useMemo(() => (
        mode === 'operation' ? operationLoading : differenceLoading
    ), [mode, operationLoading, differenceLoading]);

    const displayResult: DateTimeResult | null = currentError
        ? { error: currentError, result: undefined }
        : currentResult;

    // Show result only after form submit and not during loading
    React.useEffect(() => {
        if (!currentLoading && (currentResult || currentError)) {
            setShowResult(true);
        }
    }, [currentLoading, currentResult, currentError]);

    return (
        <Box
            sx={{
                opacity: currentLoading ? 0.7 : 1,
                pointerEvents: currentLoading ? 'none' : 'auto',
                maxWidth: '600px',
                margin: '0 auto',
                p: 2,
                position: 'relative'
            }}
        >
            <ButtonGroup fullWidth sx={{ mb: 3 }}>
                <Button
                    aria-label="Date/Time Operation"
                    variant={mode === 'operation' ? 'contained' : 'outlined'}
                    onClick={() => handleModeChange('operation')}
                    disabled={currentLoading}
                >
                    Date/Time Operation
                </Button>
                <Button
                    aria-label="Date/Time Difference"
                    variant={mode === 'difference' ? 'contained' : 'outlined'}
                    onClick={() => handleModeChange('difference')}
                    disabled={currentLoading}
                >
                    Date/Time Difference
                </Button>
                <Button
                    aria-label="Reset Calculator"
                    onClick={handleReset}
                    disabled={currentLoading}
                >
                    Reset
                </Button>
            </ButtonGroup>

            {currentLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <CircularProgress size={28} />
                </Box>
            )}

            {currentError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {currentError}
                </Alert>
            )}

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

            <Fade in={showResult && !!displayResult}>
                <div>
                    {displayResult && (
                        <ResultDisplay
                            result={displayResult}
                        />
                    )}
                </div>
            </Fade>
        </Box>
    );
};

export default DateTimeCalculator;
