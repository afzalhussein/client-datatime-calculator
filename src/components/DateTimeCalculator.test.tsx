import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DateTimeCalculator from './DateTimeCalculator';
import '@testing-library/jest-dom';
import axios from 'axios';
import { DateTimeDifferenceFormProps as DateTimeDifferenceFormMockProps } from './DateTimeDifferenceForm';
import { DateTimeOperationFormProps as DateTimeOperationFormMockProps } from './DateTimeOperationForm';
import { ResultDisplayProps as ResultDisplayMockProps } from './ResultDisplay';
import * as hooks from '../hooks';
// Mock axios
jest.mock('axios');

// Mock child components
jest.mock('./DateTimeOperationForm', () => ({
    __esModule: true,
    default: ({ onSubmit, loading }: DateTimeOperationFormMockProps) => (
        <div data-testid="operation-form">Operation Form</div>
    )
}));

jest.mock('./DateTimeDifferenceForm', () => ({
    __esModule: true,
    default: ({ onSubmit, loading }: DateTimeDifferenceFormMockProps) => (
        <div data-testid="difference-form">Difference Form</div>
    )
}));
jest.mock('./ResultDisplay', () => ({
    __esModule: true,
    default: ({ result }: ResultDisplayMockProps) => (
        <div data-testid="result-display">{JSON.stringify(result)}</div>
    )
}));

// Mock hooks
jest.mock('../hooks', () => ({
    useDateTimeOperations: jest.fn(),
    useDateTimeDifference: jest.fn(),
}));



describe('DateTimeCalculator', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (hooks.useDateTimeOperations as jest.Mock).mockReturnValue({
            executeOperation: jest.fn(),
            result: null,
            loading: false,
            error: null,
            reset: jest.fn(),
        });
        (hooks.useDateTimeDifference as jest.Mock).mockReturnValue({
            executeDifference: jest.fn(),
            result: null,
            loading: false,
            error: null,
            reset: jest.fn(),
        });
    });

    it('renders operation mode by default', () => {
        render(<DateTimeCalculator />);
        expect(screen.getByText(/Date\/Time Operation/i)).toHaveAttribute('aria-label', 'Date/Time Operation');
        expect(screen.getByTestId('operation-form')).toBeInTheDocument();
    });

    it('switches to difference mode', async () => {
        render(<DateTimeCalculator />);
        await fireEvent.click(screen.getByText(/Date\/Time Difference/i));
        expect(screen.getByTestId('difference-form')).toBeInTheDocument();
    });

    it('shows loading spinner when loading', () => {
        (hooks.useDateTimeOperations as jest.Mock).mockReturnValue({
            executeOperation: jest.fn(),
            result: null,
            loading: true,
            error: null,
            reset: jest.fn(),
        });
        render(<DateTimeCalculator />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays error alert when error occurs', () => {
        (hooks.useDateTimeOperations as jest.Mock).mockReturnValue({
            executeOperation: jest.fn(),
            result: null,
            loading: false,
            error: 'Test error',
            reset: jest.fn(),
        });
        render(<DateTimeCalculator />);
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('shows result after operation', async () => {
        (hooks.useDateTimeOperations as jest.Mock).mockReturnValue({
            executeOperation: jest.fn(),
            result: { result: '2025-07-12T12:00:00Z' },
            loading: false,
            error: null,
            reset: jest.fn(),
        });
        render(<DateTimeCalculator />);
        await waitFor(() => expect(screen.getByTestId('result-display')).toBeInTheDocument());
        expect(screen.getByTestId('result-display')).toHaveTextContent('2025-07-12T12:00:00Z');
    });

    it('resets forms and results when Reset button is clicked', async () => {
        const resetOp = jest.fn();
        const resetDiff = jest.fn();
        (hooks.useDateTimeOperations as jest.Mock).mockReturnValue({
            executeOperation: jest.fn(),
            result: { result: 'foo' },
            loading: false,
            error: null,
            reset: resetOp,
        });
        (hooks.useDateTimeDifference as jest.Mock).mockReturnValue({
            executeDifference: jest.fn(),
            result: { result: 'bar' },
            loading: false,
            error: null,
            reset: resetDiff,
        });
        render(<DateTimeCalculator />);
        await fireEvent.click(screen.getByLabelText('Reset Calculator'));
        expect(resetOp).toHaveBeenCalled();
        expect(resetDiff).toHaveBeenCalled();
    });
});