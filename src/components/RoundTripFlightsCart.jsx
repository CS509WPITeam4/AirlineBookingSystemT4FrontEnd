import React from 'react';
import {format} from 'date-fns';
import {Card, CardContent, Typography, Grid, Divider, Button, Box} from '@mui/material';
import {useNavigate} from "react-router-dom";

const RoundTripFlightsCart = ({originFlight, returnFlight}) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(`/book-flight`, {
            state: {
                flights: originFlight,
                returnFlights: returnFlight
            }
        });
    };

    // Helper to extract summary from array of segments
    const getSummary = (flights) => {
        if (!flights || flights.length === 0) return null;
        const first = flights[0];
        const last = flights[flights.length - 1];
        return {
            from: first.departAirport,
            to: last.arriveAirport,
            departDateTime: first.departDateTime,
            arriveDateTime: last.arriveDateTime,
            flightNumber: first.flightNumber
        };
    };

    const originSummary = Array.isArray(originFlight) ? getSummary(originFlight) : (originFlight ? getSummary([originFlight]) : null);
    const returnSummary = Array.isArray(returnFlight) ? getSummary(returnFlight) : (returnFlight ? getSummary([returnFlight]) : null);

    return (
        <Card sx={{maxWidth: 600, margin: 'auto', mt: 4}}>
            <CardContent>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography variant="h5" gutterBottom>
                        Round Trip Summary
                    </Typography>
                </Box>
                <Divider sx={{mb: 2}}/>

                <Grid container spacing={2}>
                    {originSummary && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Origin Flight</Typography>
                            <Typography>From: {originSummary.from}</Typography>
                            <Typography>To: {originSummary.to}</Typography>
                            <Typography>Departure: {format(new Date(originSummary.departDateTime), 'MMM dd, yyyy HH:mm')}</Typography>
                            <Typography>Arrival: {format(new Date(originSummary.arriveDateTime), 'MMM dd, yyyy HH:mm')}</Typography>
                            <Typography>Flight Number: {originSummary.flightNumber}</Typography>
                        </Grid>
                    )}
                    {returnSummary && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Return Flight</Typography>
                            <Typography>From: {returnSummary.from}</Typography>
                            <Typography>To: {returnSummary.to}</Typography>
                            <Typography>Departure: {format(new Date(returnSummary.departDateTime), 'MMM dd, yyyy HH:mm')}</Typography>
                            <Typography>Arrival: {format(new Date(returnSummary.arriveDateTime), 'MMM dd, yyyy HH:mm')}</Typography>
                            <Typography>Flight Number: {returnSummary.flightNumber}</Typography>
                        </Grid>
                    )}
                </Grid>
                {originSummary && returnSummary && (
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                        <Button variant="contained" color="primary" onClick={handleButtonClick}>
                            Book Flight
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default RoundTripFlightsCart;