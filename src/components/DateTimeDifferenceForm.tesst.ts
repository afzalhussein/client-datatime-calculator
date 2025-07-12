import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimeDifferenceForm from './DateTimeDifferenceForm';
import { DateTimeDifference } from '../types/datetime';

describe('DateTimeDifferenceForm', () => {
  const mockSubmit = jest.fn();
  
  const defaultValues: DateTimeDifference = {
    date1: '2023-01-01T00:00',
    date2: '2023-01-02T00:00',
    unit: 'days',
    timezone1: 'UTC',
    timezone2: 'UTC',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText('First Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Second Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Difference Unit')).toBeInTheDocument();
    expect(screen.getByLabelText('First Timezone')).toBeInTheDocument();
    expect(screen.getByLabelText('Second Timezone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Calculate Difference' })).toBeInTheDocument();
  });

  it('displays loading state when loading prop is true', () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} loading={true} />);
    
    const button = screen.getByRole('button', { name: 'Calculating...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('submits form with correct values', async () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} />);
    
    const date1Input = screen.getByLabelText('First Date');
    const date2Input = screen.getByLabelText('Second Date');
    const unitSelect = screen.getByLabelText('Difference Unit');
    const timezone1Input = screen.getByLabelText('First Timezone');
    const timezone2Input = screen.getByLabelText('Second Timezone');
    const submitButton = screen.getByRole('button', { name: 'Calculate Difference' });

    // Update form values
    await userEvent.type(date1Input, '2023-01-01T12:00');
    await userEvent.type(date2Input, '2023-01-02T12:00');
    await userEvent.selectOptions(unitSelect, 'hours');
    await userEvent.type(timezone1Input, 'America/New_York');
    await userEvent.type(timezone2Input, 'America/Los_Angeles');

    // Submit form
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        date1: expect.stringContaining('2023-01-01T12:00'),
        date2: expect.stringContaining('2023-01-02T12:00'),
        unit: 'hours',
        timezone1: 'America/New_York',
        timezone2: 'America/Los_Angeles',
      });
    });
  });

  it('renders with default values', () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} />);
    
    const date1Input = screen.getByLabelText('First Date') as HTMLInputElement;
    const date2Input = screen.getByLabelText('Second Date') as HTMLInputElement;
    const unitSelect = screen.getByLabelText('Difference Unit') as HTMLSelectElement;
    const timezone1Input = screen.getByLabelText('First Timezone') as HTMLInputElement;
    const timezone2Input = screen.getByLabelText('Second Timezone') as HTMLInputElement;

    expect(date1Input.value).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    expect(date2Input.value).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    expect(unitSelect.value).toBe('days');
    expect(timezone1Input.value).toBe('UTC');
    expect(timezone2Input.value).toBe('UTC');
  });

  it('updates select field correctly', async () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} />);
    
    const unitSelect = screen.getByLabelText('Difference Unit');
    
    await userEvent.selectOptions(unitSelect, 'years');
    expect((unitSelect as HTMLSelectElement).value).toBe('years');
    
    await userEvent.selectOptions(unitSelect, 'minutes');
    expect((unitSelect as HTMLSelectElement).value).toBe('minutes');
  });

  it('prevents submission when loading', async () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} loading={true} />);
    
    const submitButton = screen.getByRole('button', { name: 'Calculating...' });
    await userEvent.click(submitButton);
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});