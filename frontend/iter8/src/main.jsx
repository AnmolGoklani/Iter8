import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import AppTheme from './theme'
import { CssBaseline } from '@mui/material'
import router from './router'
import {RouterProvider} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
    {/* <App /> */}
  </StrictMode>,
)
