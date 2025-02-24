import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate forgot password logic (replace with actual API call)
    if (email) {
      setMessage(`Instructions to reset your password have been sent to ${email}.`);
    } else {
      setMessage('Please enter your email address.');
    }
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
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        {message && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer' }}
          >
            Back to Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;