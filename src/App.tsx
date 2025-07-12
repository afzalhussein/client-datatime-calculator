import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DateTimeCalculator from './components/DateTimeCalculator';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <h1>Date Time Calculator</h1>
        <DateTimeCalculator />
      </div>
    </ThemeProvider>
  );
}

export default App;