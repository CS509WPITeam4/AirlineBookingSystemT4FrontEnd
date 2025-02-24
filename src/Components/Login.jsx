import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!identifier || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    // Simulate login logic (replace with actual API call)
    const isEmail = identifier.includes('@'); // Simple check to determine if input is an email
    if (
      (isEmail && identifier === 'admin@gmail.com' && password === 'password') ||
      (!isEmail && identifier === 'admin' && password === 'password')
    ) {
      setError('');
      alert('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard or home page
    } else {
      setError('Invalid username/email or password.');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Redirect to forgot password page
  };

  const handleSignUp = () => {
    navigate('/signup'); // Redirect to signup page
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
          Login
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username or Email"
            autoFocus
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
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
      </Box>
    </Container>
  );
};

export default Login;