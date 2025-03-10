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
import deltaLogo from '../assets/images/delta.png';
import southwestLogo from '../assets/images/southwest.png';

const StyledCard = styled(Card)(({ theme, selected }) => ({
  border: selected ? `2px solid ${theme.palette.primary.main}` : "none",
  boxShadow: selected ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "0px 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

// Makes date and time readable
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

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
        height="30"
        image={
          flight.flightNumber.startsWith('DL') 
            ? deltaLogo 
            : flight.flightNumber.startsWith('WN')
            ? southwestLogo
            : none.png
        }
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
            <Typography variant="subtitle1">{flight.departAirport}</Typography>
          </Grid>
          <Grid item xs={2} textAlign="center">
            <Typography variant="h6">→</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle1">{flight.arriveAirport}</Typography>
          </Grid>
        </Grid>

        {/* Flight Time & Duration */}
        <Typography variant="body2" color="textSecondary">
          ____________________________________
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Departure:
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDate(flight.departDateTime)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ____________________________________
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Arrival:
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDate(flight.arriveDateTime)}
        </Typography>
        

        {/* Price & Buttons */}
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
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
