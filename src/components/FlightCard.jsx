import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
  Chip,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme, selected }) => ({
  border: selected ? `2px solid ${theme.palette.primary.main}` : "none",
  boxShadow: selected ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "0px 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(!selected);
  };

  return (
    <StyledCard selected={selected} sx={{ display: "flex", flexDirection: "column", width: "100%", mb: 2 }}>
      {/* Airline Logo */}
      <CardMedia
        component="img"
        height="40"
        image={flight.airlineLogoUrl}
        alt={`${flight.airlineName} Logo`}
        sx={{ objectFit: "contain", padding: "10px" }}
      />

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {flight.airlineName}
        </Typography>

        {/* Flight Route */}
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={5}>
            <Typography variant="subtitle1">{flight.departureAirport} ({flight.departureCity})</Typography>
          </Grid>
          <Grid item xs={2} textAlign="center">
            <Typography variant="h6">→</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle1">{flight.arrivalAirport} ({flight.arrivalCity})</Typography>
          </Grid>
        </Grid>

        {/* Flight Time & Duration */}
        <Typography variant="body2" color="textSecondary">
          Departure: {flight.departureTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Arrival: {flight.arrivalTime}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", mt: 1 }}>
          Duration: {flight.flightDuration}
        </Typography>

        {/* Price & Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            ${flight.ticketPrice}
          </Typography>

          {flight.soldOut ? (
            <Chip label="Sold Out" color="error" />
          ) : (
            <Button
              variant={selected ? "contained" : "outlined"}
              color="primary"
              onClick={handleSelect}
            >
              {selected ? "Selected" : "Select Flight"}
            </Button>
          )}
        </Box>

        {/* View Details Link */}
        <Button 
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate(`/flight-details/${flight.flightId}`)}
        >
          View Details
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default FlightCard;
