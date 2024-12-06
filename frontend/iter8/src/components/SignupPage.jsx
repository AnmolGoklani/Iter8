import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert
} from '@mui/material';
import { Signup } from '../apiservice';

const SignupPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    passwordMatch: false
  });

  const [signupMessage, setSignupMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        setErrors({
          ...errors,
          passwordMatch: true
        });
        return;
    }
    
    setErrors({
        ...errors,
        passwordMatch: false
    });

    try {
      const response = await Signup(formData.name, formData.username, formData.email, formData.password);
      setSignupMessage(response.message);

      if(response.message === 'signup successful') {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }

    } catch {
        setSignupMessage('User already exists');
    }


    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
        setErrors({
            ...errors,
            passwordMatch: false
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {signupMessage && (
          <Alert severity={signupMessage === 'signup successful' ? 'success' : 'error'} sx={{ mt: 2 }}>
            {signupMessage}
          </Alert>
        )}

        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={errors.passwordMatch}
            helperText={errors.passwordMatch ? "Passwords do not match" : ""}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;