import {createTheme} from '@mui/material'

const AppTheme = createTheme({
    palette: {
        primary:{
            main: '#6272a4',
        },
        secondary:{
            main: '#ff79c6',
        },
        background: {
            default: '#282a36',
            paper: '#44475a',
        },
        error:{
            main: '#ff5555',
        },
        info:{
            main: '#8be9fd',
        },
        text:{
            primary: '#f8f8f2',
            secondary: '#6272a4',
        },
        success:{
            main: '#50fa7b',
        },
        warning: {
            main: '#f1fa8c',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
          fontSize: '2rem',
          fontWeight: 500,
        },
        h2: {
          fontSize: '1.5rem',
          fontWeight: 500,
        },
        h3: {
          fontSize: '1.25rem',
          fontWeight: 500,
        },
        body1: {
          fontSize: '1rem',
        },
        body2: {
          fontSize: '0.875rem',
        },
        button: {
          textTransform: 'none',
        },
    },
});

export default AppTheme;