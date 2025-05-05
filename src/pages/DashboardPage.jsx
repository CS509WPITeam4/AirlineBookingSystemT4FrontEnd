import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { format } from 'date-fns';

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
  const [error] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);

useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (!token || !userData) {
    navigate('/login');
    return;
  }

  setUser(JSON.parse(userData));

  axios.get('http://localhost:8080/api/bookings/retrieve', { params: { userId: JSON.parse(userData).id } })
    .then(async response => {
      const bookingsData = response.data;

      const enrichedBookings = await Promise.all(
        bookingsData.map(async booking => {
          const departureDetails = await Promise.all(
            (booking.departures || []).map(id =>
              axios.get('http://localhost:8080/api/flights/details', { params: { id } })
                .then(res => res.data)
                .catch(() => null)
            )
          );
          const returnDetails = await Promise.all(
            (booking.returns || []).map(id =>
              axios.get('http://localhost:8080/api/flights/details', { params: { id } })
                .then(res => res.data)
                .catch(() => null)
            )
          );

          return {
            ...booking,
            departures: departureDetails.filter(Boolean),
            returns: returnDetails.filter(Boolean),
          };
        })
      );

      setBookings(enrichedBookings);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching bookings:', error);
      setIsLoading(false);
    });
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

  if (!user) {
    return null; // Will redirect to login in useEffect
  }
  const [firstName, lastName] = user.username ? user.username.split('_') : ['John', 'Doe'];
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography component="h1" variant="h4" color="primary">
            My Dashboard
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* User Profile Section */}
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
                  {capitalize(firstName)} {capitalize(lastName)}
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
                  <Tab label="Departure Flights" />
                  <Tab label="Return Flights" />
                </Tabs>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Typography>
              )}

              {isLoading ? (
                <Typography>Loading your bookings...</Typography>
              ) : (
                <>
                  {tabValue === 0 && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Your Departure Flights
                      </Typography>
                      {bookings.filter(b => b.departures.length > 0).length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            You don&#39;t have any departure flights.
                          </Typography>
                          <Button variant="contained" onClick={handleBookFlight}>
                            Book a Flight
                          </Button>
                        </Box>
                      ) : (
                        bookings.map(booking =>
                          booking.departures.map((flight, idx) => (
                            <Box key={`${booking.id}-dep-${idx}`} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs={8}>
                                  <Typography variant="body1">Flight Number: {flight.flightNumber}</Typography>
                                  <Typography variant="body2">From: {flight.departAirport} To: {flight.arriveAirport}</Typography>
                                  <Typography variant="body2">Departure: {format(new Date(flight.departDateTime), 'PPpp')}</Typography>
                                  <Typography variant="body2">Arrival: {format(new Date(flight.arriveDateTime), 'PPpp')}</Typography>
                                </Grid>
                                <Grid item>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/modify-flight/${flight.id}`)}
                                  >
                                    Modify Flight
                                  </Button>
                                </Grid>
                              </Grid>
                            </Box>
                          ))
                        )
                      )}
                    </>
                  )}

                  {tabValue === 1 && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Your Return Flights
                      </Typography>
                      {bookings.filter(b => b.returns.length > 0).length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1">
                            No return flights to display.
                          </Typography>
                        </Box>
                      ) : (
                        bookings.map(booking =>
                          booking.returns.map((flight, idx) => (
                            <Box key={`${booking.id}-ret-${idx}`} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs={8}>
                                  <Typography variant="body1">Flight Number: {flight.flightNumber}</Typography>
                                  <Typography variant="body2">From: {flight.departAirport} To: {flight.arriveAirport}</Typography>
                                  <Typography variant="body2">Departure: {format(new Date(flight.departDateTime), 'PPpp')}</Typography>
                                  <Typography variant="body2">Arrival: {format(new Date(flight.arriveDateTime), 'PPpp')}</Typography>
                                </Grid>
                                <Grid item>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/modify-flight/${flight.id}`)}
                                  >
                                    Modify Flight
                                  </Button>
                                </Grid>
                              </Grid>
                            </Box>
                          ))
                        )
                      )}
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