import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Create a custom DPG-inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a', // Dark Navy
    },
    secondary: {
      main: '#22c55e', // Green for positive stats
    },
    background: {
      default: '#f1f5f9',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)