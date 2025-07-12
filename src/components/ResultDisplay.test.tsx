import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultDisplay from './ResultDisplay';
import { DateTimeResult } from '../types/datetime';

describe('ResultDisplay', () => {
    test('displays loading spinner when loading', () => {
        render(<ResultDisplay result={null} loading={true} />);
        expect(screen.getByLabelText('Loading results')).toBeInTheDocument();
        expect(screen.getByTestId('result-display-loading')).toBeInTheDocument();
    });

    test('renders nothing when result is null and not loading', () => {
        const { container } = render(<ResultDisplay result={null} />);
        // Check that no result content is rendered
        expect(container).not.toHaveTextContent('Difference:');
        expect(container).not.toHaveTextContent('Result:');
        expect(container).not.toHaveTextContent('No result to display');
    });

    test('displays error message when result contains error', () => {
        const errorResult: DateTimeResult = {
            error: 'Calculation failed',
            errorDetails: 'Invalid date format'
        };
        render(<ResultDisplay result={errorResult} />);

        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);

        expect(screen.getByText('Calculation failed')).toBeInTheDocument();
        expect(screen.getByText('Invalid date format')).toBeInTheDocument();
        expect(screen.getByTestId('result-display-error')).toBeInTheDocument();
    });

    test('displays info message when result is empty', () => {
        const emptyResult: DateTimeResult = {};
        render(<ResultDisplay result={emptyResult} />);

        expect(screen.getByText('No result to display')).toBeInTheDocument();
        expect(screen.getByTestId('result-display-empty')).toBeInTheDocument();
    });

    test('displays difference calculation correctly', () => {
        const differenceResult: DateTimeResult = {
            result: 5,
            unit: 'days',
            is_negative: true
        };
        render(<ResultDisplay result={differenceResult} />);

        expect(screen.getByText('Difference:')).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            const hasText = (node: Element | null) => node?.textContent === '5 days (negative)';
            const elementHasText = hasText(element);
            const childrenDontHaveText = Array.from(element?.children || []).every(
                child => !hasText(child)
            );
            return elementHasText && childrenDontHaveText;
        })).toBeInTheDocument();
        expect(screen.getByTestId('result-display-difference')).toBeInTheDocument();
    });

    test('displays date operation result correctly', () => {
        const dateResult: DateTimeResult = {
            result: '2023-01-01T00:00:00Z',
            timezone: 'UTC',
            operation: 'add'
        };
        render(<ResultDisplay result={dateResult} />);

        expect(screen.getByText('Result:')).toBeInTheDocument();
        expect(screen.getByText(/UTC/)).toBeInTheDocument();
        expect(screen.getByText(/add/)).toBeInTheDocument();
        expect(screen.getByTestId('result-display-operation')).toBeInTheDocument();
    });

    test('has proper ARIA attributes for loading state', () => {
        render(<ResultDisplay result={null} loading={true} />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByLabelText('Loading results')).toBeInTheDocument();
    });

    test('has proper ARIA attributes for error state', () => {
        const errorResult: DateTimeResult = { error: 'Test error' };
        render(<ResultDisplay result={errorResult} />);

        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
        alerts.forEach(alert => {
            expect(alert).toBeInTheDocument();
        });
    });
});