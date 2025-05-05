import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Box, Autocomplete, TextField, Button, CircularProgress, Typography, Grid, Alert, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, ToggleButton, ToggleButtonGroup, InputLabel, Select, MenuItem, ListItemText, Tab, Tabs } from '@mui/material';
import DestinationGallery from '../components/DestinationGallery';
import RoundTripFlightsCart from "../components/RoundTripFlightsCart.jsx";
import FlightCard from '../components/FlightCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchFlightsPage = () => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [error, setError] = useState("");
  const [selectedAirlines, setSelectedAirlines] = useState(['Southwest', 'Delta']);
  const [sortType, setSortType] = useState('Total Time');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [roundTrip, setRoundTrip] = useState(false);
  const [maxStops, setMaxStops] = useState(5);
  const [maxLayover, setMaxLayover] = useState(300);
  const [selectedTab, setSelectedTab] = useState('departures');
  const [selectedOriginFlight, setSelectedOriginFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/locations?size=91")
      .then(response => {
        const locationNames = response.data.map(location => `${location.cityName} (${location.iataCode})`);
        setLocations(locationNames);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

  const handleAirlineChange = useCallback((event, airline) => {
    setSelectedAirlines((prev) =>
      event.target.checked
        ? [...prev, airline]
        : prev.filter((item) => item !== airline)
    );
  }, []);

  // Handle searching flights
  const handleSearch = () => {
    if (!origin || !destination) {
      setError("Please select both origin and destination.");
      return;
    }


    if (roundTrip && (!returnDate && departureDate || returnDate && !departureDate)) {
      alert('Please select a departure and return date or leave both blank');
      return;
    }
    
    setLoading(true);
    setError("");
    setSearchPerformed(true);
    setSelectedAirlines(['Southwest', 'Delta']);

    // Get call for search
    axios
      .get("http://localhost:8080/api/flights/search", {
        params: {
          departAirport: origin,
          arriveAirport: destination,
          departureDate: departureDate ? departureDate.toISOString().split('T')[0] : null,
          maxLayover: maxLayover
        }
      })
      .then(response => {
        console.log('Response data:', response.data);
        setFlights(response.data);
      })
      .catch(error => {
        console.error("Error searching for flights:", error);
        setError("Failed to load flight data. Please try again later.");
      })
      .finally(() => {
        // Set loading to false after flight search finishes
        setLoading(false);
      });

    // Return search if round trip
    if(roundTrip && returnDate) {
      axios
        .get("http://localhost:8080/api/flights/search", {
          params: {
            departAirport: destination,
            arriveAirport: origin,
            departureDate: returnDate ? returnDate.toISOString().split('T')[0] : null,
            maxLayover: maxLayover
          }
        })
        .then(response => {
          console.log('Response data:', response.data);
          setReturnFlights(response.data);
        })
        .catch(error => {
          console.error("Error searching for flights:", error);
          setError("Failed to load flight data. Please try again later.");
        });
    } else {
      setReturnFlights([]);
    }
    
  };

  // Get full duration of flight (counting layovers)
  const getDuration = (flights) => {
    if (!flights || flights.length === 0) return "";
  
    const depart = new Date(flights[0].departDateTime).getTime();
    const arrive = new Date(flights[flights.length - 1].arriveDateTime).getTime();
    const diffMs = arrive < depart ? arrive + 24 * 60 * 60 * 1000 - depart : arrive - depart;
    const totalMinutes = Math.floor(diffMs / 1000 / 60);
  
    return totalMinutes;
  };

  // Filter departing flights (arlines, number of stops)
  const filteredFlights = flights.filter((flight) => {
    if (selectedAirlines.length === 0) {
      return true;
    }
    if(flight.flights.length - 1 > maxStops) {
      return false;
    }
    return flight.flights.every((flight) => {
      const flightNumber = flight.flightNumber;
  
      if (selectedAirlines.includes('Southwest') && flightNumber.startsWith('WN')) {
        return true;
      }
  
      if (selectedAirlines.includes('Delta') && flightNumber.startsWith('DL')) {
        return true;
      }
  
      return false;
    });
  });

  // Filter returning flights (arlines, number of stops)
  const filteredReturnFlights = returnFlights.filter((flight) => {
    if (selectedAirlines.length === 0) {
      return true;
    }
    if(flight.flights.length - 1 > maxStops) {
      return false;
    }
    return flight.flights.every((flight) => {
      const flightNumber = flight.flightNumber;
  
      if (selectedAirlines.includes('Southwest') && flightNumber.startsWith('WN')) {
        return true;
      }
  
      if (selectedAirlines.includes('Delta') && flightNumber.startsWith('DL')) {
        return true;
      }
  
      return false;
    });
  });

  // Sort departing flights from shortest to longest
  // const sortedFlights = filteredFlights.sort((flightCard1, flightCard2) => {
  const sortedFlights = [...filteredFlights].sort((flightCard1, flightCard2) => {
    if(sortType === 'Total Time') {
      const totalTime1 = getDuration(flightCard1.flights);
      const totalTime2 = getDuration(flightCard2.flights);
      return totalTime1 - totalTime2;
    } else if (sortType === 'Depart Time') {
      const departTime1 = new Date(flightCard1.flights[0].departDateTime);
      const departTime2 = new Date(flightCard2.flights[0].departDateTime);
      return departTime1 - departTime2;
    }
    const arriveTime1 = new Date(flightCard1.flights[0].arriveDateTime);
    const arriveTime2 = new Date(flightCard2.flights[0].arriveDateTime);
    return arriveTime1 - arriveTime2;
  });

  // Sort returning flights from shortest to longest
  const sortedReturnFlights = filteredReturnFlights.length > 0 
    ? filteredReturnFlights.sort((flightCard1, flightCard2) => {
        const totalTime1 = getDuration(flightCard1.flights);
        const totalTime2 = getDuration(flightCard2.flights);
        return totalTime1 - totalTime2;
      })
    : [];

  // Allowed dates
  const allowedDates = [
    new Date(2022, 11, 26),
    new Date(2022, 11, 27),
    new Date(2022, 11, 28),
    new Date(2022, 11, 29),
    new Date(2022, 11, 30),
    new Date(2022, 11, 31),
    new Date(2023, 0, 1),
    new Date(2023, 0, 2),
    new Date(2023, 0, 3),
    new Date(2023, 0, 4),
    new Date(2023, 0, 5)
  ];

  const airlineOptions = ['Delta', 'Southwest'];
  const sortOptions = ['Total Time', 'Depart Time', 'Arrive Time'];

  return (
    <>
      <Box sx={{ width: '100vw', height: '50vh', overflow: 'hidden' }}>
        <DestinationGallery />
      </Box>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Find Your Next Destination!
        </Typography>
        {/* Main filters */}
        <Box display="flex" alignItems="center" gap={2} mt={3}>
          {/* Origin */}
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
              />
            )}
            sx={{ flex: 1 }}
            disableClearable
            disableCloseOnSelect
            disablePortal
            openOnFocus
            disabled={loading}
          />

          {/* Destination */}
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
              />
            )}
            sx={{ flex: 1 }}
            disableClearable
            disableCloseOnSelect
            disablePortal
            openOnFocus
            disabled={loading}
          />

          {/* Departure */}
          <Box sx={{ width: roundTrip ? 130 : 200 }}>
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              placeholderText="Departure"
              dateFormat="yyyy-MM-dd"
              includeDates={allowedDates}
              openToDate={new Date(2022, 11, 26)}
              customInput={<TextField label="Departure" variant="outlined" fullWidth />}
            />
          </Box>

          {/* Return */}
          <Box sx={{ width: roundTrip ? 130 : 0 }}>
          {roundTrip && (
            <DatePicker
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              placeholderText="Return"
              dateFormat="yyyy-MM-dd"
              includeDates={allowedDates}
              openToDate={new Date(2023, 0, 5)}
              customInput={<TextField label="Return" variant="outlined" fullWidth />}
            />
          )} </Box>

          {/* Find */}
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


        {/* Additional filters */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={2}>
          {/* Trip type (round trip or one way) */}
          <ToggleButtonGroup
            value={roundTrip ? 'roundtrip' : 'oneway'}
            exclusive
            onChange={(e, value) => {
              if (value) {
                const isRoundTrip = value === 'roundtrip';
                setRoundTrip(isRoundTrip);
                if (!isRoundTrip) {
                  setReturnDate(null);
                }
                setSelectedTab("departures");
              }
            }}
            color="primary"
            size="small"
          >
            <ToggleButton value="oneway" sx={{ minWidth: 90 }}>One Way</ToggleButton>
            <ToggleButton value="roundtrip" sx={{ minWidth: 90 }}>Round Trip</ToggleButton>
          </ToggleButtonGroup>

          {/* Sort */}
          <FormControl
            size="small"
            sx={{ width: 160 }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              labelId="airlines-label"
              label="Sort By"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              renderValue={(selected) => (selected)}
            >
              {sortOptions.map((sort) => (
                <MenuItem key={sort} value={sort}>
                  <ListItemText primary={sort} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Max Stops */}
          <TextField
            label="Max Stops"
            type="number"
            size="small"
            value={maxStops}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setMaxStops(isNaN(value) || value < 0 ? 0 : value);
            }}
            inputProps={{ min: 0 }}
            sx={{ width: 100 }}
          />

          {/* Airlines */}
          <FormControl
            size="small"
            sx={{ width: 170 }}
          >
            <InputLabel>Airlines</InputLabel>
            <Select
              labelId="airlines-label"
              label="Airlines"
              multiple
              value={selectedAirlines}
              onChange={(e) => setSelectedAirlines(e.target.value)}
              renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : '')}
            >
              {airlineOptions.map((airline) => (
                <MenuItem key={airline} value={airline}>
                  <Checkbox checked={selectedAirlines.includes(airline)} />
                  <ListItemText primary={airline} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Max Layover */}
          <TextField
            label="Max Layover (min)"
            type="number"
            size="small"
            value={maxLayover}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setMaxLayover(isNaN(value) || value < 0 ? 0 : value);
            }}
            inputProps={{ min: 0 }}
            sx={{ width: 130 }}
          />

        </Box>

        {/* Round Trip Flights Cart (always show when roundTrip) */}
        {roundTrip && (
          <Box sx={{ mb: 3 }}>
            <RoundTripFlightsCart
                originFlight={selectedOriginFlight}
                returnFlight={selectedReturnFlight}
            />
          </Box>
        )}

        {loading ? (
          <CircularProgress />
        ) : error ? (
          error && <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {searchPerformed && (
              <>
                {flights.length > 0 || returnFlights.length > 0 ? (
                  <>
                    {/* Tabs (if return flight exists) */}
                    {roundTrip && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Tabs
                          value={selectedTab}
                          onChange={(e, newTab) => setSelectedTab(newTab)}
                          aria-label="flight tabs"
                          sx={{ width: '40%' }}
                        >
                          <Tab label="Departure" value="departures" sx={{ flex: 1, textAlign: 'center' }} />
                          <Tab label="Return" value="arrivals" sx={{ flex: 1, textAlign: 'center' }} />
                        </Tabs>
                      </Box>
                    )}

                    {/* Flight Cards */}
                    <Grid container item xs={12} spacing={3}>
                      {selectedTab === 'departures' ? (
                        sortedFlights.length > 0 ? (
                          sortedFlights.map((flightCardDTO, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <FlightCard flightCardDTO={flightCardDTO} direction={roundTrip ? 'origin' : undefined} onSelectFlight={setSelectedOriginFlight} />
                            </Grid>
                          ))
                        ) : (
                          <Typography sx={{ marginTop: 3 }}>No flights found for the selected route.</Typography>
                        )
                      ) : (
                        sortedReturnFlights.length > 0 ? (
                          sortedReturnFlights.map((flightCardDTO, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <FlightCard flightCardDTO={flightCardDTO} direction="return" onSelectFlight={setSelectedReturnFlight} />
                            </Grid>
                          ))
                        ) : (
                          <Typography sx={{ marginTop: 3 }}>No flights found for the selected route.</Typography>
                        )
                      )}
                    </Grid>
                  </>
                ) : (
                  <Typography sx={{ marginTop: 3 }}>No flights found for the selected route.</Typography>
                )}
              </>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default SearchFlightsPage;
