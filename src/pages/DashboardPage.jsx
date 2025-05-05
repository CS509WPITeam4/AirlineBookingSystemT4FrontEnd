import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tab,
  Tabs
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }


    const parsedUser = JSON.parse(userData);
    const userId = parsedUser.id;
    setUser(parsedUser);

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError('Could not load bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleBookFlight = () => {
    navigate('/search-flights');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const currentDate = new Date();
  const upcoming = bookings.filter(b => new Date(b.flights[0]?.departDateTime) > currentDate);
  const past = bookings.filter(b => new Date(b.flights[0]?.departDateTime) <= currentDate);

  if (!user) return null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography component="h1" variant="h4" color="primary">My Dashboard</Typography>
          <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        </Box>

        <Grid container spacing={3}>
          {/* Left: Profile and navigation */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>

                

                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    mb: 2
                  }}
                >

                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5">
                  {user.username
                    ? decodeURIComponent(user.username)
                        .split('_')[0]
                        .replace(/^\w/, c => c.toUpperCase())
                    : 'John'}{' '}
                  {user.username
                    ? decodeURIComponent(user.username)
                        .split('_')[1]
                        .replace(/^\w/, c => c.toUpperCase())
                    : 'Doe'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email || 'user@example.com'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Details"
                    secondary="Manage your personal information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Travel History"
                    secondary="View your trips"
                  />
                </ListItem>
              </List>

              <ListItem
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/bookings')}
              >
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText
                    primary="My Bookings"
                    secondary="View your flight bookings"
                />
              </ListItem>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleBookFlight}
                  sx={{ py: 1.5 }}
                >
                  Book a New Flight
                </Button>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Bookings Section */}
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab label="Upcoming Trips" />
                  <Tab label="Past Trips" />
                </Tabs>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 2, mb: 2 }}>{error}</Typography>
              )}

              {isLoading ? (
                <Typography>Loading your bookings...</Typography>
              ) : (
                <>
                  {tabValue === 0 && (
                    <>


                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Your Upcoming Trips
                      </Typography>

                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          You don&#39;t have any upcoming trips.
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={handleBookFlight}
                        >
                          Book a Flight
                        </Button>
                      </Box>
                    </>
                  )}

                  {tabValue === 1 && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Your Past Trips
                      </Typography>

                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1">
                          No past trips to display.
                        </Typography>
                      </Box>
                    </>
                  )}
                </>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
