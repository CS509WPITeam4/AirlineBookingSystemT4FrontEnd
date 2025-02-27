import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Link, Paper } from '@mui/material';
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // API endpoint - directly defined here instead of importing from config
  const API_URL = 'https://your-backend-api-url.com/api/auth/forgot-password';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Using the API URL directly in the component
      await axios.post(API_URL, { email });
      
      // Show success message
      setIsSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
        <StyledPaper>
          {!isSubmitted ? (
            <>
              <Typography component="h1" variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                Forgot Password
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              
              {error && (
                <Typography color="error" sx={{ mt: 1, mb: 2 }}>
                  {error}
                </Typography>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Reset Password'}
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleBackToLogin}
                    sx={{ cursor: 'pointer' }}
                  >
                    Back to Login
                  </Link>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                Check Your Email
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                We've sent a password reset link to: <strong>{email}</strong>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
                Please check your email and follow the instructions to reset your password.
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
                Didn't receive an email? Check your spam folder or try again.
              </Typography>
              
              <Button
                variant="outlined"
                onClick={handleBackToLogin}
                sx={{ mt: 2 }}
              >
                Back to Login
              </Button>
            </>
          )}
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;