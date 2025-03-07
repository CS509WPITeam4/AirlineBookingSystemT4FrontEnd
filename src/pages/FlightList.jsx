import React, { useEffect, useState } from "react";
import { Grid, Container, Typography, CircularProgress, Alert } from "@mui/material";
import FlightCard from "../components/FlightCard";
import axios from "axios";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/flights")
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.error("Error fetching flights:", error);
        setError("Failed to load flight data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Available Flights
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {flights.length > 0 ? (
            flights.map((flight) => (
              <Grid item xs={12} sm={6} md={4} key={flight.flightId}>
                <FlightCard flight={flight} />
              </Grid>
            ))
          ) : (
            <Typography>No flights available.</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default FlightList;
