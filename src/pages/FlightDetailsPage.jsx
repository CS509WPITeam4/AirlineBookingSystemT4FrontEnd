import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [flightDetails, setFlightDetails] = useState(null);
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

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Simulate API call to fetch flight details
    setIsLoading(true);
    
    // Mock data - in a real app, this would be an API call using the flightId
    setTimeout(() => {
      const mockFlightDetails = {
        id: flightId || 'FL123',
        airline: 'WPI Airways',
        flightNumber: 'WPI256',
        departureAirport: {
          code: 'BOS',
          name: 'Boston Logan International',
          terminal: 'B',
          gate: '25'
        },
        arrivalAirport: {
          code: 'JFK',
          name: 'New York John F. Kennedy',
          terminal: 'T4',
          gate: '12'
        },
        departureTime: '2023-12-15T08:30:00',
        arrivalTime: '2023-12-15T10:15:00',
        duration: '1h 45m',
        seatsAvailable: 8,
        totalSeats: 180,
        price: 109.99,
        baggage: {
          carryOn: 'One personal item + one carry-on bag (max 10kg)',
          checked: 'First checked bag: $30, Second: $40'
        }
      };

      setFlightDetails(mockFlightDetails);
      setIsLoading(false);
    }, 500); // Load quickly for better UX
  }, [flightId, navigate]);

  const handleBack = () => {
    if (activeStep === 0) {
      // Navigate to dashboard instead of search results
      navigate('/dashboard');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleBackToSearchResults = () => {
    // Navigate to dashboard instead of search results
    navigate('/dashboard');
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

  const steps = ['Flight Summary', 'Passenger Information', 'Payment Details', 'Confirmation'];

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

  if (!flightDetails) {
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
          
          <TextField
            size="small"
            placeholder="Search flights"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleSearchFlights}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
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
            <Typography variant="h5" sx={{ mb: 3 }}>
              Flight Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AirplanemodeActiveIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {flightDetails.airline} - Flight {flightDetails.flightNumber}
                </Typography>
              </Box>
              <Typography variant="h6" color="primary">
                ${flightDetails.price.toFixed(2)}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={5}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(flightDetails.departureTime)}
                  </Typography>
                  <Typography variant="h5">
                    {formatTime(flightDetails.departureTime)}
                  </Typography>
                  <Typography variant="h6">
                    {flightDetails.departureAirport.code}
                  </Typography>
                  <Typography variant="body2">
                    {flightDetails.departureAirport.name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <AccessTimeIcon color="action" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {flightDetails.duration}
                </Typography>
              </Grid>

              <Grid item xs={5} sx={{ textAlign: 'right' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(flightDetails.arrivalTime)}
                  </Typography>
                  <Typography variant="h5">
                    {formatTime(flightDetails.arrivalTime)}
                  </Typography>
                  <Typography variant="h6">
                    {flightDetails.arrivalAirport.code}
                  </Typography>
                  <Typography variant="body2">
                    {flightDetails.arrivalAirport.name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Price Details:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Base fare</Typography>
                <Typography variant="body2">${(flightDetails.price - 42.50).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Taxes & fees</Typography>
                <Typography variant="body2">$42.50</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1" fontWeight="bold">${flightDetails.price.toFixed(2)}</Typography>
              </Box>
            </Box>

            {flightDetails.seatsAvailable < 20 && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                Only {flightDetails.seatsAvailable} seats left! Complete your booking soon.
              </Alert>
            )}
          </StyledPaper>
        )}

        {activeStep === 1 && (
          <StyledPaper>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Passenger Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={passengerInfo.firstName}
                  onChange={handlePassengerInfoChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={passengerInfo.lastName}
                  onChange={handlePassengerInfoChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={passengerInfo.email}
                  onChange={handlePassengerInfoChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  value={passengerInfo.phone}
                  onChange={handlePassengerInfoChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={passengerInfo.dateOfBirth}
                  onChange={handlePassengerInfoChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="passportNumber"
                  label="Passport Number"
                  value={passengerInfo.passportNumber}
                  onChange={handlePassengerInfoChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="seat-preference-label">Seat Preference</InputLabel>
                  <Select
                    labelId="seat-preference-label"
                    name="seatPreference"
                    value={passengerInfo.seatPreference}
                    onChange={handlePassengerInfoChange}
                    label="Seat Preference"
                  >
                    <MenuItem value="window">Window</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="aisle">Aisle</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </StyledPaper>
        )}

        {activeStep === 2 && (
          <StyledPaper>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Payment Details
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo payment form. In a real application, use a secure payment processor.
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="cardName"
                  label="Name on Card"
                  value={paymentInfo.cardName}
                  onChange={handlePaymentInfoChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="cardNumber"
                  label="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                  fullWidth
                  required
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentInfoChange}
                  fullWidth
                  required
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="cvv"
                  label="CVV"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentInfoChange}
                  fullWidth
                  required
                  type="password"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Price Summary:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Flight fare</Typography>
                <Typography variant="body2">${flightDetails.price.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle1">Total Amount</Typography>
                <Typography variant="subtitle1" fontWeight="bold">${flightDetails.price.toFixed(2)}</Typography>
              </Box>
            </Box>
          </StyledPaper>
        )}

        {activeStep === 3 && (
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
                <Typography variant="body2" color="text.secondary">Airline</Typography>
                <Typography variant="body1">{flightDetails.airline}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Flight Number</Typography>
                <Typography variant="body1">{flightDetails.flightNumber}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Departure</Typography>
                <Typography variant="body1">
                  {formatDate(flightDetails.departureTime)}, {formatTime(flightDetails.departureTime)}
                </Typography>
                <Typography variant="body1">
                  {flightDetails.departureAirport.name} ({flightDetails.departureAirport.code})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Arrival</Typography>
                <Typography variant="body1">
                  {formatDate(flightDetails.arrivalTime)}, {formatTime(flightDetails.arrivalTime)}
                </Typography>
                <Typography variant="body1">
                  {flightDetails.arrivalAirport.name} ({flightDetails.arrivalAirport.code})
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>Passenger Information</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{passengerInfo.firstName} {passengerInfo.lastName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Contact</Typography>
                <Typography variant="body1">{passengerInfo.email}</Typography>
                <Typography variant="body1">{passengerInfo.phone}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Seat Preference</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{passengerInfo.seatPreference}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Price Summary:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Flight fare</Typography>
                <Typography variant="body2">${flightDetails.price.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle1">Total Amount</Typography>
                <Typography variant="subtitle1" fontWeight="bold">${flightDetails.price.toFixed(2)}</Typography>
              </Box>
            </Box>
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