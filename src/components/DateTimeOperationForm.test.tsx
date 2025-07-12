import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DateTimeOperationForm from './DateTimeOperationForm';

describe('DateTimeOperationForm', () => {
    const mockSubmit = jest.fn((data) => {
        return Promise.resolve(data);
    });

    beforeEach(() => {
        mockSubmit.mockClear();
    });

    test('renders all form fields with default values', () => {
        render(<DateTimeOperationForm onSubmit={mockSubmit} />);

        expect(screen.getByLabelText('Date')).toBeInTheDocument();
        expect(screen.getByLabelText('Years')).toBeInTheDocument();
        expect(screen.getByLabelText('Months')).toBeInTheDocument();
        expect(screen.getByLabelText('Weeks')).toBeInTheDocument();
        expect(screen.getByLabelText('Days')).toBeInTheDocument();
        expect(screen.getByLabelText('Hours')).toBeInTheDocument();
        expect(screen.getByLabelText('Minutes')).toBeInTheDocument();
        expect(screen.getByLabelText('Seconds')).toBeInTheDocument();
        expect(screen.getByLabelText('Operation')).toBeInTheDocument();
        expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Calculate' })).toBeInTheDocument();
    });

    test('disables submit button when loading', () => {
        render(<DateTimeOperationForm onSubmit={mockSubmit} loading={true} />);
        expect(screen.getByRole('button', { name: 'Calculating...' })).toBeDisabled();
    });

    test('submits form with correct data', async () => {
        render(<DateTimeOperationForm onSubmit={mockSubmit} />);

        // Fill out all form fields
        fireEvent.change(screen.getByLabelText('Date'), {
            target: { value: '2023-01-01T12:00' }
        });
        fireEvent.change(screen.getByLabelText('Years'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Months'), { target: { value: '2' } });
        fireEvent.change(screen.getByLabelText('Weeks'), { target: { value: '3' } });
        fireEvent.change(screen.getByLabelText('Days'), { target: { value: '4' } });
        fireEvent.change(screen.getByLabelText('Hours'), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '6' } });
        fireEvent.change(screen.getByLabelText('Seconds'), { target: { value: '7' } });

        // Change operation
        fireEvent.mouseDown(screen.getByLabelText('Operation'));
        const subtractOption = await screen.findByRole('option', { name: /subtract/i });
        fireEvent.click(subtractOption);

        // Change timezone
        fireEvent.change(screen.getByLabelText('Timezone'), {
            target: { value: 'America/New_York' }
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalled();
            const callArgs = mockSubmit.mock.calls[0][0];
            expect(callArgs).toEqual(expect.objectContaining({
                date: '2023-01-01T12:00',
                years: 1,
                months: 2,
                weeks: 3,
                days: 4,
                hours: 5,
                minutes: 6,
                seconds: 7,
                operation: 'subtract',
                timezone: 'America/New_York'
            }));
        });
    });

    test('converts numeric inputs to numbers', async () => {
        render(<DateTimeOperationForm onSubmit={mockSubmit} />);

        fireEvent.change(screen.getByLabelText('Years'), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText('Months'), { target: { value: '6' } });
        fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));

        await waitFor(() => {
            const submittedData = mockSubmit.mock.calls[0][0];
            expect(submittedData.years).toBe(5);
            expect(submittedData.months).toBe(6);
        });
    });

    test('has proper accessibility attributes', () => {
        render(<DateTimeOperationForm onSubmit={mockSubmit} />);

        expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'datetime-local');
        expect(screen.getByLabelText('Years')).toHaveAttribute('type', 'number');
        expect(screen.getByLabelText('Operation')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Calculate' })).toHaveAttribute('type', 'submit');
    });
});