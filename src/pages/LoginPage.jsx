import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Link, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/login';

// Styled components
const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  color: '#1976d2',
  fontWeight: '700',
  marginBottom: theme.spacing(1),
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  color: '#637381',
  marginBottom: theme.spacing(3),
}));

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    try {
    const loginData = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };

    const response = await axios.post(API_URL, loginData);

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to connect to the server. Please try again.');
    }
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  const handleSignUp = () => {
    navigate('/signup');
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Added new wrapper component */}
        <LoginPaper elevation={3}>
          {/* Logo and welcome text */}
          <LogoWrapper>
            <FlightTakeoffIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <WelcomeText variant="h4">Welcome to WPI Airways</WelcomeText>
            <SubtitleText variant="body1">Sign in to continue to your account</SubtitleText>
          </LogoWrapper>

          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username or Email"
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.2,
                borderRadius: '8px',
                fontWeight: '600',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Sign In
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ cursor: 'pointer' }}
              >
                Forgot Password?
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={handleSignUp}
                sx={{ cursor: 'pointer' }}
              >
                Create New Account
              </Link>
            </Box>
          </Box>
        </LoginPaper>
      </Box>
    </Container>
  );
};

export default LoginPage;