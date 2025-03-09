import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Autocomplete, TextField, Button, CircularProgress, Typography } from '@mui/material';
import DestinationGallery from '../components/DestinationGallery';

const SearchFlightsPage = () => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/locations?size=91")
      .then(response => {
        const locationNames = response.data.map(location => location.cityName);
        setLocations(locationNames);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

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
            disableFreeSolo
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
            disableFreeSolo
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
          >
            Find
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SearchFlightsPage;
