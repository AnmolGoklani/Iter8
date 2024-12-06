import {createTheme} from '@mui/material'

const AppTheme = createTheme({

    palette: {
        primary:{
            main: '#4876EE',
        },
        secondary:{
            main: '#1AAFFF',
        },
        background: {
            default: '#f0f0f0',
        },
        error:{
            main: '#FF0000',
        },
        info:{
            main: '#FFA500',
        },
        text:{
            primary: '#000000',
            secondary: '#808080',
        },
        success:{
            main: '#008000',
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