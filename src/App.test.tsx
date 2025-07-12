import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/DateTimeCalculator', () => () => (
  <div data-testid="datetime-calculator" />
));

describe('App', () => {
  test('renders the heading and DateTimeCalculator component', () => {
    render(<App />);

    // Heading is present
    expect(screen.getByRole('heading', { name: /date time calculator/i })).toBeInTheDocument();

    // DateTimeCalculator component is rendered
    expect(screen.getByTestId('datetime-calculator')).toBeInTheDocument();
  });
});
