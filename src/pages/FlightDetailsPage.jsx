import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import SearchIcon from '@mui/icons-material/Search';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const FlightDetailsPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Passenger information form
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    passportNumber: '',
    seatPreference: 'window'
  });
  
  // Payment information form (in a real app, use a secure payment processor)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [flights, setFlights] = useState(
    () => location.state?.flights || []
  );
  
  if (!flights.length) {
    return (
      <Container>
        <Typography>No flight data found.</Typography>
      </Container>
    );
  }

  useEffect(() => {
    if (flights) {
      localStorage.setItem("flightDetails", JSON.stringify(flights));
    }
  }, [flights]);
  

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Load page
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [flightId, navigate]);

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/search-flights');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleBackToSearchResults = () => {
    navigate('/search-flights');
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePassengerInfoChange = (e) => {
    setPassengerInfo({
      ...passengerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInfoChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchFlights = () => {
    if (searchQuery) {
      // Navigate to dashboard with search query
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchFlights();
    }
  };

  const handleCompleteBooking = () => {
    // In a real app, this would send booking information to the backend
    alert('Booking completed successfully!');
    navigate('/dashboard', { state: { bookingSuccess: true } });
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time to readable format
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Get flight time for a single flight
  const getDuration = (t1, t2) => {
    if (!t1 || !t2) return "";
  
    const depart = new Date(t1).getTime();
    const arrive = new Date(t2).getTime();
    const diffMs = arrive < depart ? arrive + 24 * 60 * 60 * 1000 - depart : arrive - depart;
    const totalMinutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return `${hours} hr ${minutes} min`;
  };

  const steps = ['Flight Summary', 'Confirmation'];

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Loading booking information...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToSearchResults}
            sx={{ mt: 2 }}
          >
            Back to Search Results
          </Button>
        </Box>
      </Container>
    );
  }

  if (!flights) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Flight details not found.</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToSearchResults}
            sx={{ mt: 2 }}
          >
            Back to Search Results
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Navigation and search bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToSearchResults}
          >
            Back to Search Results
          </Button>
        </Box>

        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Book Your Flight
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <StyledPaper>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Flight Summary
            </Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Departure ({getDuration(flights[0].departDateTime, flights[flights.length - 1].arriveDateTime)})
            </Typography>

            {flights.map((flight, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(flight.departDateTime)}
                      </Typography>
                      <Typography variant="h5">
                        {formatTime(flight.departDateTime)}
                      </Typography>
                      <Typography variant="h6">
                        {flight.departAirport.split('(')[0]}
                      </Typography>
                      <Typography variant="body2">
                        {flight.departAirport.split('(')[1].split(')')[0]}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <AccessTimeIcon color="action" />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {getDuration(flight.departDateTime, flight.arriveDateTime)}
                    </Typography>
                  </Grid>

                  <Grid item xs={5} sx={{ textAlign: 'right' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(flight.arriveDateTime)}
                      </Typography>
                      <Typography variant="h5">
                        {formatTime(flight.arriveDateTime)}
                      </Typography>
                      <Typography variant="h6">
                        {flight.arriveAirport.split('(')[0]}
                      </Typography>
                      <Typography variant="body2">
                        {flight.arriveAirport.split('(')[1].split(')')[0]}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {index < flights.length - 1 && (
                  <Box sx={{ position: 'relative', my: 3 }}>
                    <Divider />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'background.paper',
                        px: 1,
                      }}
                    >
                      Layover: {getDuration(flights[index].arriveDateTime, flights[index + 1].departDateTime)}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}

          </StyledPaper>
        )}

        {activeStep === 1 && (
          <StyledPaper>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Booking Confirmation
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              Your booking is ready to be confirmed!
            </Alert>

            <Typography variant="h6" sx={{ mb: 2 }}>Flight Information</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Departure</Typography>
                <Typography variant="body1">
                  {formatDate(flights[0].departDateTime)}, {formatTime(flights[0].departDateTime)}
                </Typography>
                <Typography variant="body1">
                  {flights[0].departAirport}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Arrival</Typography>
                <Typography variant="body1">
                  {formatDate(flights[flights.length - 1].arriveDateTime)}, {formatTime(flights[flights.length - 1].arriveDateTime)}
                </Typography>
                <Typography variant="body1">
                  {flights[flights.length - 1].arriveAirport}
                </Typography>
              </Grid>
            </Grid>

          </StyledPaper>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {activeStep === 0 ? 'Back to Search Results' : 'Back'}
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleCompleteBooking : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Complete Booking' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FlightDetailsPage;