import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimeDifferenceForm from './DateTimeDifferenceForm';
import { DateTimeDifference } from '../types/datetime';

describe('DateTimeDifferenceForm', () => {
  const mockSubmit: jest.Mock<(data: DateTimeDifference) => void> = jest.fn();

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

    const date1Input = screen.getByLabelText('First Date') as HTMLInputElement;
    const date2Input = screen.getByLabelText('Second Date') as HTMLInputElement;
    const unitSelect = screen.getByLabelText('Difference Unit');
    const unitInput = screen.getByRole('combobox', { name: 'Difference Unit' }).parentElement!.querySelector('input[name="unit"]') as HTMLInputElement;
    const timezone1Input = screen.getByLabelText('First Timezone') as HTMLInputElement;
    const timezone2Input = screen.getByLabelText('Second Timezone') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'Calculate Difference' });

    // Clear and update form values
    await userEvent.clear(date1Input);
    await userEvent.type(date1Input, '2023-01-01T12:00');
    await userEvent.clear(date2Input);
    await userEvent.type(date2Input, '2023-01-02T12:00');
    await userEvent.clear(timezone1Input);
    await userEvent.type(timezone1Input, 'America/New_York');
    await userEvent.clear(timezone2Input);
    await userEvent.type(timezone2Input, 'America/Los_Angeles');

    // Select 'hours' option
    await userEvent.click(unitSelect);
    const hoursOption = await screen.findByRole('option', { name: 'Hours' });
    await userEvent.click(hoursOption);

    // Verify input values before submission
    await waitFor(() => {
      expect(date1Input).toHaveValue('2023-01-01T12:00');
      expect(date2Input).toHaveValue('2023-01-02T12:00');
      expect(unitInput).toHaveValue('hours');
      expect(timezone1Input).toHaveValue('America/New_York');
      expect(timezone2Input).toHaveValue('America/Los_Angeles');
    });

    // Submit form
    await userEvent.click(submitButton);

    // Debug mockSubmit calls
    await waitFor(() => {
      console.log('mockSubmit calls:', mockSubmit.mock.calls);
      expect(mockSubmit).toHaveBeenCalledWith({
        date1: '2023-01-01T12:00',
        date2: '2023-01-02T12:00',
        unit: 'hours',
        timezone1: 'America/New_York',
        timezone2: 'America/Los_Angeles',
      });
    }, { timeout: 2000 });
  });

  it('renders with default values', () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} />);

    const date1Input = screen.getByLabelText('First Date') as HTMLInputElement;
    const date2Input = screen.getByLabelText('Second Date') as HTMLInputElement;
    const unitInput = screen.getByRole('combobox', { name: 'Difference Unit' }).parentElement!.querySelector('input[name="unit"]') as HTMLInputElement;
    const timezone1Input = screen.getByLabelText('First Timezone') as HTMLInputElement;
    const timezone2Input = screen.getByLabelText('Second Timezone') as HTMLInputElement;

    expect(date1Input.value).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    expect(date2Input.value).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    expect(unitInput).toHaveValue('days');
    expect(timezone1Input.value).toBe('UTC');
    expect(timezone2Input.value).toBe('UTC');
  });

  it('updates select field correctly', async () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} />);

    const unitSelect = screen.getByLabelText('Difference Unit');
    const unitInput = screen.getByRole('combobox', { name: 'Difference Unit' }).parentElement!.querySelector('input[name="unit"]') as HTMLInputElement;

    // Open the dropdown and select 'years'
    await userEvent.click(unitSelect);
    const yearsOption = await screen.findByRole('option', { name: 'Years' });
    await userEvent.click(yearsOption);
    expect(unitInput).toHaveValue('years');

    // Open the dropdown and select 'minutes'
    await userEvent.click(unitSelect);
    const minutesOption = await screen.findByRole('option', { name: 'Minutes' });
    await userEvent.click(minutesOption);
    expect(unitInput).toHaveValue('minutes');
  });

  it('prevents submission when loading', () => {
    render(<DateTimeDifferenceForm onSubmit={mockSubmit} loading={true} />);

    const submitButton = screen.getByRole('button', { name: 'Calculating...' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});