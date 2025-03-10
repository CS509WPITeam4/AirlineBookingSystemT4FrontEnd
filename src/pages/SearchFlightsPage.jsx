import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Autocomplete, TextField, Button, CircularProgress, Typography, Grid, Alert } from '@mui/material';
import DestinationGallery from '../components/DestinationGallery';
import FlightCard from '../components/FlightCard';

const SearchFlightsPage = () => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/locations?size=91")
      .then(response => {
        // I had to change this because the get call needs the IATA too or it won't work
        //const locationNames = response.data.map(location => location.cityName);
        const locationNames = response.data.map(location => `${location.cityName} (${location.iataCode})`);
        setLocations(locationNames);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

  // Handle searching flights
  const handleSearch = () => {
    if (!origin || !destination) {
      setError("Please select both origin and destination.");
      return;
    }
    
    setLoading(true);
    setError("");

    console.log('GET Request:', 'http://localhost:8080/api/flights/search', {
      params: {
        departAirport: origin,
        arriveAirport: destination,
      }
    });

    // Get call for search
    axios
      .get("http://localhost:8080/api/flights/search", {
        params: {
          departAirport: origin,
          arriveAirport: destination,
        }
      })
      .then(response => {
        setFlights(response.data);
      })
      .catch(error => {
        console.error("Error searching for flights:", error);
        setError("Failed to load flight data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Box sx={{ width: '100vw', height: '50vh', overflow: 'hidden' }}>
        <DestinationGallery />
      </Box>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Find Your Next Destination!
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mt={3}>
          <Autocomplete
            options={locations}
            value={origin}
            onChange={(event, newValue) => setOrigin(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Origin"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ flex: 1 }}
            disableClearable
            // disableFreeSolo
            disableCloseOnSelect
            disablePortal
            openOnFocus
            disabled={loading}
          />
          <Autocomplete
            options={locations}
            value={destination}
            onChange={(event, newValue) => setDestination(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ flex: 1 }}
            disableClearable
            // disableFreeSolo
            disableCloseOnSelect
            disablePortal
            openOnFocus
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ height: '56px' }}
            disabled={loading}
            onClick={handleSearch}
          >
            Find
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          error && <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <Grid item xs={12} sm={6} md={4} key={flight.flightId}>
                  <FlightCard flight={flight} />
                </Grid>
              ))
            ) : (
              <Typography>No flights found for the selected route.</Typography>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default SearchFlightsPage;
