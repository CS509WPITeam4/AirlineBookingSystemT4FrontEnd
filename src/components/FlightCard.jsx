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
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import deltaLogo from '../assets/images/delta_logo.png';
import southwestLogo from '../assets/images/southwest_logo.png';
import bothLogo from '../assets/images/both_logo_1.png';

const StyledCard = styled(Card)(({ theme, selected }) => ({
  border: selected ? `2px solid ${theme.palette.primary.main}` : "none",
  boxShadow: selected
    ? "0px 4px 12px rgba(0, 0, 0, 0.2)"
    : "0px 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

// Formats the date
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return formattedDate;
};

// Formats the time
const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return formattedTime;
};

// Get full duration of flight (counting layovers)
const getDuration = (flights) => {
  if (!flights || flights.length === 0) return "";

  const depart = new Date(flights[0].departDateTime).getTime();
  const arrive = new Date(flights[flights.length - 1].arriveDateTime).getTime();
  const diffMs = arrive < depart ? arrive + 24 * 60 * 60 * 1000 - depart : arrive - depart;
  const totalMinutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} hr ${minutes} min`;
};

// Flight card object
const FlightCard = ({ flightCardDTO, direction, onSelectFlight}) => {
  const { flights } = flightCardDTO;
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(!selected);
  };

  const handleButtonClick = () => {
    if (direction === 'origin' && onSelectFlight) {
      onSelectFlight(flightCardDTO.flights);
    } else if (direction === 'return' && onSelectFlight) {
      onSelectFlight(flightCardDTO.flights);
    } else if (!direction) {
      navigate(`/book-flight`, {
        state: { flights: flightCardDTO.flights }
      });
    }
  };

  // Shows the correct logo
  const airlines = flights.reduce(
    (acc, flight) => {
      if (flight.flightNumber.startsWith("DL")) acc.delta = true;
      if (flight.flightNumber.startsWith("WN")) acc.southwest = true;
      return acc;
    },
    { delta: false, southwest: false }
  );

  return (
    <StyledCard selected={selected} sx={{ display: "flex", flexDirection: "column", width: "100%", mb: 2 }}>
      {/* Airline Logos */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
          m: 0,
          lineHeight: 0,
        }}
      >
        {airlines.delta && airlines.southwest ? (
          <CardMedia
            component="img"
            src={bothLogo}
            alt="Delta and Southwest"
            height="30"
            sx={{ objectFit: "contain" }}
          />
        ) : airlines.delta ? (
          <CardMedia
            component="img"
            src={deltaLogo}
            alt="Delta"
            height="30"
            sx={{ objectFit: "contain" }}
          />
        ) : airlines.southwest ? (
          <CardMedia
            component="img"
            src={southwestLogo}
            alt="Southwest"
            height="30"
            sx={{ objectFit: "contain" }}
          />
        ) : null}
      </Box>

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {flights[0].airlineName}
        </Typography>

        {/* Flight Data */}
        <Box key={flights[0].flightId} mt={-3}>
          <Divider sx={{ my: 1 }} />

          {/* Duration and stops */}
          <Box textAlign="center" mt={1}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {getDuration(flights)}
            </Typography>

            {/* Number of stops */}
            <Typography variant="body1" color="textSecondary">
              {flights.length === 1
                ? "Nonstop"
                : `${flights.length - 1} stop${flights.length - 1 > 1 ? "s" : ""}`}
            </Typography>

            {/* IATA route */}
            <Typography variant="body2" color="textSecondary">
              {flights
                .map((flight, index) => {
                  const code = flight.departAirport.split('(')[1].split(')')[0];
                  if (index === flights.length - 1) {
                    const lastCode = flight.arriveAirport.split('(')[1].split(')')[0];
                    return `${code} → ${lastCode}`;
                  }
                  return code;
                })
                .join(" → ")}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* Flight Time & Duration */}
          <Typography variant="body1" color="textSecondary" align="center">
            {formatDate(flights[0].departDateTime) === formatDate(flights[flights.length - 1].arriveDateTime)
            ? formatDate(flights[0].departDateTime)
            : `${formatDate(flights[0].departDateTime)} - ${formatDate(flights[flights.length - 1].arriveDateTime)}`}
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            {`${formatTime(flights[0].departDateTime)} - ${formatTime(flights[flights.length - 1].arriveDateTime)}`}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* Book/Add Flight Button */}
        <Button
          fullWidth
          sx={{ mt: 0, mb: 0, p: 0 }}
          onClick={handleButtonClick}
        >
          {direction === 'origin'
            ? 'Add Origin Flight'
            : direction === 'return'
            ? 'Add Return Flight'
            : 'Book Flight'}
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default FlightCard;
