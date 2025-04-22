import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    CircularProgress,
    Tabs,
    Tab,
    Divider,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';


// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
}));

const BookingCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const StatusChip = styled(Box)(({status }) => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor:
        status === 'Confirmed' ? '#e6f7e6' :
            status === 'Cancelled' ? '#fce8e8' :
                status === 'Pending' ? '#fff8e1' :
                    status === 'Completed' ? '#e3f2fd' : '#f5f5f5',
    color:
        status === 'Confirmed' ? '#0d6e0d' :
            status === 'Cancelled' ? '#d32f2f' :
                status === 'Pending' ? '#f57c00' :
                    status === 'Completed' ? '#0277bd' : '#757575',
}));

const Bookings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        // Fetch bookings data as per AC2
        const fetchBookings = async () => {
            try {
                setIsLoading(true);

                // Get the userId from localStorage
                const parsedUser = JSON.parse(userData);
                const userId = parsedUser.id;

                // Make API call to fetch bookings - THIS SATISFIES AC2
                try {
                    const response = await fetch(`/api/bookings?userId=${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    setBookings(data);
                } catch (apiError) {
                    console.error('API error:', apiError);
                    setError('Failed to load your bookings. Please try again later.');
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Failed to load your bookings. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleBookFlight = () => {
        navigate('/search-flights');
    };

    // Utility functions for date and time formatting
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleTimeString('en-US', options);
    };

    // Group and sort bookings
    const currentDate = new Date();

    const upcomingFlights = bookings
        .filter(booking => new Date(booking.departureDateTime) > currentDate)
        .sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime));

    const pastFlights = bookings
        .filter(booking => new Date(booking.departureDateTime) <= currentDate)
        .sort((a, b) => new Date(b.departureDateTime) - new Date(a.departureDateTime));

    // Booking card component for rendering each booking
    const renderBookingCard = (booking) => (
        <BookingCard key={booking.id} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirplanemodeActiveIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                        Flight {booking.flightNumber}
                    </Typography>
                </Box>
                <StatusChip status={booking.status}>
                    {booking.status}
                </StatusChip>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlightTakeoffIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            Departure
                        </Typography>
                    </Box>
                    <Typography variant="h6">
                        {booking.departureAirport}
                    </Typography>
                    <Typography variant="body2">
                        {formatDate(booking.departureDateTime)}
                    </Typography>
                    <Typography variant="body2">
                        {formatTime(booking.departureDateTime)}
                    </Typography>
                </Grid>

                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Divider orientation="vertical" flexItem />
                </Grid>

                <Grid item xs={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlightLandIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            Arrival
                        </Typography>
                    </Box>
                    <Typography variant="h6">
                        {booking.arrivalAirport}
                    </Typography>
                    <Typography variant="body2">
                        {formatDate(booking.arrivalDateTime)}
                    </Typography>
                    <Typography variant="body2">
                        {formatTime(booking.arrivalDateTime)}
                    </Typography>
                </Grid>
            </Grid>
        </BookingCard>
    );

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {/* Back button */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={handleBackToDashboard} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="body1">Back to Dashboard</Typography>
                </Box>

                {/* My Bookings Header */}
                <Typography component="h1" variant="h4" color="primary" sx={{ mb: 4 }}>
                    My Bookings
                </Typography>

                {/* Booking Tabs */}
                <StyledPaper>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                        >
                            <Tab label="Upcoming Flights" />
                            <Tab label="Past Flights" />
                        </Tabs>
                    </Box>

                    {error && (
                        <Typography color="error" sx={{ mt: 2, mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Loading bookings...</Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Check if there are any bookings */}
                            {bookings.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        No bookings found. Start exploring flights!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={handleBookFlight}
                                    >
                                        Find Flights
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    {/* Show bookings based on active tab */}
                                    {tabValue === 0 && (
                                        <>
                                            {upcomingFlights.length > 0 ? (
                                                upcomingFlights.map(booking => renderBookingCard(booking))
                                            ) : (
                                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                                        You don't have any upcoming flights.
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleBookFlight}
                                                    >
                                                        Book a Flight
                                                    </Button>
                                                </Box>
                                            )}
                                        </>
                                    )}

                                    {tabValue === 1 && (
                                        <>
                                            {pastFlights.length > 0 ? (
                                                pastFlights.map(booking => renderBookingCard(booking))
                                            ) : (
                                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                                    <Typography variant="body1">
                                                        No past flights to display.
                                                    </Typography>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </StyledPaper>
            </Box>
        </Container>
    );
};

export default Bookings;