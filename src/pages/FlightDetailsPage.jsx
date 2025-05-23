import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightSegmentCard from '../components/FlightSegmentCard';


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

  const [flights, setflights] = useState(() => location.state?.flights || []);
  const [returnFlights, setReturnFlights] = useState(() => location.state?.returnFlights || []);

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

  const handleCompleteBooking = () => {
    console.log("handleCompleteBooking called");
    axios
          .post("http://localhost:8080/api/bookings/create", {
            departures: flights,
            returns: returnFlights
          })
          .then(response => {
            alert('Booking completed successfully!');
            console.log('Response data:', response.data);
            navigate('/dashboard');
          })
          .catch(error => {
            console.error("Error creating booking: ", error);
            alert('Failed to create booking. Please try again later.');
            setError("Failed to create booking. Please try again later.");
          })
          .finally(() => {
            // Set loading to false after booking finished
            setIsLoading(false);
          });
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

  // Dynamically build the steps array based on flights and returnFlights
  const steps = [];
  if (flights.length > 0) {
    steps.push('Origin Flight');
  }
  if (returnFlights.length > 0) {
    steps.push('Return Flight');
  }
  steps.push('Confirmation');

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
            <FlightSegmentCard
              title="Origin Flight"
              flights={flights}
              formatDate={formatDate}
              formatTime={formatTime}
              getDuration={getDuration}
            />
          </StyledPaper>
        )}

        {activeStep === steps.length - 1 && (
          <StyledPaper>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Booking Confirmation
            </Typography>

            <Alert severity="success" sx={{ mb: 3 }}>
              Your booking is ready to be confirmed!
            </Alert>

            <Typography variant="h6" sx={{ mb: 2 }}>Origin Flight Information</Typography>
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
                  {formatDate(flights[flights.length -1].arriveDateTime)}, {formatTime(flights[flights.length -1].arriveDateTime)}
                </Typography>
                <Typography variant="body1">
                  {flights[flights.length -1].arriveAirport}
                </Typography>
                <Typography variant="body2" color="text.secondary">Flight Numbers</Typography>
                <Typography variant="body1">
                  {flights.map(f => f.flightNumber).join(', ')}
                </Typography>
              </Grid>
            </Grid>

            {returnFlights.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>Return Flight Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Departure</Typography>
                    <Typography variant="body1">
                      {formatDate(returnFlights[0].departDateTime)}, {formatTime(returnFlights[0].departDateTime)}
                    </Typography>
                    <Typography variant="body1">
                      {returnFlights[0].departAirport}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Arrival</Typography>
                    <Typography variant="body1">
                      {formatDate(returnFlights[returnFlights.length -1].arriveDateTime)}, {formatTime(returnFlights[returnFlights.length -1].arriveDateTime)}
                    </Typography>
                    <Typography variant="body1">
                      {returnFlights[returnFlights.length -1].arriveAirport}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Flight Numbers</Typography>
                    <Typography variant="body1">
                      {returnFlights.map(f => f.flightNumber).join(', ')}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}

          </StyledPaper>
        )}

        {activeStep === 1 && returnFlights.length > 0 && (
          <StyledPaper>
            <FlightSegmentCard
              title="Return Flight"
              flights={returnFlights}
              formatDate={formatDate}
              formatTime={formatTime}
              getDuration={getDuration}
            />
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