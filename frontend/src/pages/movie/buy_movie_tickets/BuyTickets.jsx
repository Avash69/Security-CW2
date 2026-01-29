
import {
  AccessTime as AccessTimeIcon,
  ConfirmationNumber as TicketIcon,
  Event as EventIcon,
  KeyboardBackspace as BackIcon,
  LocalMovies as LocalMoviesIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  getShowByMovieIdApi,
  getSeatsByShowIdApi,
  createBookingApi,
  initializeKhaltiApi,
} from '../../../apis/Api';
import axios from 'axios';
import KhaltiCheckout from 'khalti-checkout-web';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BuyTickets.css';

const BuyTickets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [show, setShow] = useState(null);
  const [allShows, setAllShows] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        const response = await getShowByMovieIdApi(id);

        if (response.data.success) {
          if (response.data.shows && response.data.shows.length > 0) {
            setAllShows(response.data.shows);
            setShow(response.data.shows[0]);
          } else {
            setError('No shows are currently scheduled for this movie. Please check back soon cinemates!');
          }
        } else {
          setError(response.data.message || 'Unable to find any shows for this movie.');
        }
      } catch (err) {
        console.error('Critical failure fetching shows:', err);
        setError(err.response?.data?.message || 'Connection lost. Please ensure the backend is active.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [id]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!show) return;
      try {
        const response = await getSeatsByShowIdApi(show._id);
        if (response.data.success) {
          setSeats(response.data.seats);
        }
      } catch (err) {
        console.error('Failed to fetch seats:', err);
        toast.error('Unable to load seat layout');
      }
    };

    fetchSeats();
  }, [show]);

  const handleSeatClick = (seat) => {
    if (!seat.available) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find(s => s._id === seat._id);
      if (isSelected) {
        return prev.filter(s => s._id !== seat._id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const movie = show?.movieId || {};
  const showDate = show ? new Date(show.showDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const showTime = show?.showTime || '';
  const posterUrl = movie.moviePosterImage ? `http://localhost:5000/movies/${movie.moviePosterImage}` : '';

  const handlePayment = async () => {
    if (!selectedSeats.length) {
      toast.warning('Please select at least one seat');
      return;
    }

    if (!show || !movie.movieName) {
      toast.error('Booking information is incomplete');
      return;
    }

    try {
      setProcessing(true);

      // 1. Create Booking (Status will be 'pending')
      const bookingData = {
        show: show._id,
        price: selectedSeats.length * (show.showPrice || 0),
        seats: selectedSeats.map(s => s._id)
      };

      const bookingResponse = await createBookingApi(bookingData);

      if (!bookingResponse.data.success) {
        throw new Error(bookingResponse.data.message || 'Failed to create booking');
      }

      const bookingId = bookingResponse.data.id;

      // 2. Initialize Khalti Payment
      const paymentData = {
        itemId: bookingId,
        totalPrice: selectedSeats.length * (show.showPrice || 0) * 100, // In paisa
        website_url: window.location.origin
      };

      const paymentResponse = await initializeKhaltiApi(paymentData);

      if (paymentResponse.data.success && paymentResponse.data.payment_url) {
        toast.info('Redirecting to Khalti secure checkout...');
        window.location.href = paymentResponse.data.payment_url;
      } else {
        throw new Error(paymentResponse.data.message || 'Failed to initialize payment');
      }

    } catch (err) {
      console.error('Payment Flow Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Payment initialization failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617' }}>
        <CircularProgress sx={{ color: '#1976D2' }} />
      </Box>
    );
  }

  if (error || !show) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617', color: 'white', gap: 3, p: 4, textAlign: 'center' }}>
        <LocalMoviesIcon sx={{ fontSize: 80, opacity: 0.2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, maxWidth: 500 }}>{error || 'Movie Mitra could not locate this show sequence.'}</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ color: 'white', borderColor: 'white', borderRadius: 2 }}>
          Return to Homepage
        </Button>
      </Box>
    );
  }

  return (
    <Box className="booking-root">
      {/* Cinematic Hero */}
      <Box className="booking-hero">
        <Box className="hero-backdrop" sx={{ backgroundImage: `url(${posterUrl})` }} />
        <Box className="hero-overlay" />
        <Container maxWidth="lg" className="hero-content">
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', mb: 4, bgcolor: 'rgba(255,255,255,0.1)' }}>
            <BackIcon />
          </IconButton>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item>
              {movie.moviePosterImage && (
                <Paper sx={{
                  width: isMobile ? 120 : 180,
                  height: isMobile ? 180 : 270,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img src={posterUrl} alt={movie.movieName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Paper>
              )}
            </Grid>
            <Grid item xs>
              <Typography variant="overline" sx={{ color: theme.palette.primary.main, fontWeight: 800, letterSpacing: '0.2em' }}>NOW BOOKING</Typography>
              <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: '-0.04em', lineHeight: 1, mb: 1 }}>{movie.movieName}</Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>Movie Mitra Cinema</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>{showDate} at {showTime}</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Booking Terminal */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Box className="booking-container fade-up">
              <Box className="screen-container">
                <Box className="screen-visual">
                  <Typography className="screen-text">Screen</Typography>
                </Box>
              </Box>

              <Box className="seat-grid">
                {seats.map((seat) => {
                  const isSelected = selectedSeats.find(s => s._id === seat._id);
                  const isOccupied = !seat.available;
                  return (
                    <Box
                      key={seat._id}
                      onClick={() => handleSeatClick(seat)}
                      className={`seat-box ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                      sx={{
                        cursor: isOccupied ? 'not-allowed' : 'pointer',
                        opacity: isOccupied ? 0.4 : 1,
                        pointerEvents: isOccupied ? 'none' : 'auto'
                      }}
                    >
                      {seat.seatNo}
                    </Box>
                  );
                })}
              </Box>

              <Stack direction="row" spacing={4} sx={{ mt: 6, justifyContent: 'center' }}>
                <Box className="legend-item">
                  <Box className="legend-color" sx={{ bgcolor: 'var(--seat-available)' }} />
                  Available
                </Box>
                <Box className="legend-item">
                  <Box className="legend-color" sx={{ bgcolor: 'var(--primary-glow)' }} />
                  Selected
                </Box>
                <Box className="legend-item">
                  <Box className="legend-color" sx={{ bgcolor: 'var(--seat-occupied)' }} />
                  Occupied
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box className="booking-container fade-up" sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Booking Summary</Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Movie</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{movie.movieName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{showTime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Selected Seats</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {selectedSeats.length ? selectedSeats.map(s => s.seatNo).join(', ') : 'None'}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', py: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Total Price</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                    Rs. {selectedSeats.length * (show.showPrice || 0)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!selectedSeats.length || processing}
                  onClick={handlePayment}
                  startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    mt: 2,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: '0 10px 20px rgba(25, 118, 210, 0.2)'
                    }
                  }}
                >
                  {processing ? 'Processing...' : 'Book Now with Khalti'}
                </Button>
                <Typography variant="caption" sx={{ color: '#64748B', textAlign: 'center', display: 'block' }}>
                  Secured payment via Khalti Gateway
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BuyTickets;
