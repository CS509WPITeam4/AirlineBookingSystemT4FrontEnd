import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const FlightSegmentCard = ({ title, flights, formatDate, formatTime, getDuration }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {title}
            </Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
                Departure ({getDuration(flights[0].departDateTime, flights[flights.length - 1].arriveDateTime)})
            </Typography>

            {flights.map((flight, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(flight.departDateTime)}
                                </Typography>
                                <Typography variant="h5">
                                    {formatTime(flight.departDateTime)}
                                </Typography>
                                <Typography variant="h6">
                                    {flight.departAirport.split('(')[0]}
                                </Typography>
                                <Typography variant="body2">
                                    {flight.departAirport.split('(')[1]?.split(')')[0]}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <AccessTimeIcon color="action" />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {getDuration(flight.departDateTime, flight.arriveDateTime)}
                            </Typography>
                        </Grid>

                        <Grid item xs={5} sx={{ textAlign: 'right' }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(flight.arriveDateTime)}
                                </Typography>
                                <Typography variant="h5">
                                    {formatTime(flight.arriveDateTime)}
                                </Typography>
                                <Typography variant="h6">
                                    {flight.arriveAirport.split('(')[0]}
                                </Typography>
                                <Typography variant="body2">
                                    {flight.arriveAirport.split('(')[1]?.split(')')[0]}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Flight Number
                                </Typography>
                                <Typography variant="body1">
                                    {flight.flightNumber}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {index < flights.length - 1 && (
                        <Box sx={{ position: 'relative', my: 3 }}>
                            <Divider />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    position: 'absolute',
                                    top: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: 'background.paper',
                                    px: 1,
                                }}
                            >
                                Layover: {getDuration(flights[index].arriveDateTime, flights[index + 1].departDateTime)}
                            </Typography>
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default FlightSegmentCard;