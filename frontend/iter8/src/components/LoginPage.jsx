// LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  Divider,
  Alert
} from '@mui/material';
import {Login, handleChanneliClick} from '../apiservice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const [LoginMessage, setLoginMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Login(formData.username, formData.password);
      setLoginMessage(response.message);

      if(response.message === 'login successful') {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }

    } catch {
        setLoginMessage('Invalid credentials');
    }
  };

  const handleoauthLogin = () => {
    handleChanneliClick();
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'background.paper', borderColor: 'text.secondary' }}>
          <Typography variant="h5" align="center" sx={{ mb: 3 }} color="text.primary">
            Login
          </Typography>

          {LoginMessage && (
          <Alert severity={LoginMessage === 'login successful' ? 'success' : 'error'} sx={{ mt: 2, mb: 2}}>
            {LoginMessage}
          </Alert>
        )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: '#f8f8f2' } }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: '#f8f8f2' } }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
            >
              Login
            </Button>
          </form>
          
          <Divider sx={{ my: 2, borderColor: 'text.secondary' }}>OR</Divider>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleoauthLogin}
            sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}
          >
            Login with Channeli
          </Button>

          <Typography align="center" sx={{ mt: 2 }} color="text.primary">
            Don&apos;t have an account?{' '}
            <Button 
              color="primary"
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none' }}
            >
              Sign up
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;