import React from 'react';
import { Typography, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" sx={{ mt: 4 }}>
        Welcome to the Dashboard!
      </Typography>
    </Container>
  );
};

export default Dashboard;