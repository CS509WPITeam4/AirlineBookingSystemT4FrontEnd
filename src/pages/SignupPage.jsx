import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Link, 
  Grid, 
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // API endpoint - directly defined here instead of importing from config
  const API_URL = 'http://localhost:8080/api/users/signup';

  // User information
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    setError('');
    return true;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      // Using the API URL directly in the component
      const response = await axios.post(API_URL, formData);

      // Handle successful registration
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledPaper sx={{ width: '100%' }}>
          <Typography component="h1" variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
            Create an Account
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{ py: 1.5, px: 4 }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleLogin}
                sx={{ cursor: 'pointer' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default SignupPage;