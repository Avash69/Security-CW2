
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
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${id}`);
        setShow(response.data);
      } catch (err) {
        console.error('Failed to fetch show:', err);
        setError('Failed to load show details. Please try again later.');
        toast.error('Unable to load show details');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handlePayment = () => {
    if (!selectedSeats.length) {
      toast.warning('Please select at least one seat');
      return;
    }

    if (!show) return;

    const config = {
      publicKey: '649f06815d4942178072493f83258c78',
      productIdentity: id,
      productName: show.movieTitle,
      productUrl: window.location.href,
      eventHandler: {
        onSuccess(payload) {
          console.log('Payment successful!', payload);
          toast.success('Payment Successful! Tickets Booked.');
          // Redirect or handle booking finalization
          setTimeout(() => navigate('/tickets'), 2000);
        },
        onError(error) {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        },
        onClose() {
          console.log('Khalti widget closed');
        },
      },
      paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: selectedSeats.length * show.showPrice * 100 });
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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617', color: 'white' }}>
        <Typography variant="h6">{error || 'Show details not found'}</Typography>
      </Box>
    );
  }

  const showDate = new Date(show.showTime).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const showTime = new Date(show.showTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box className="booking-root">
      {/* Cinematic Hero */}
      <Box className="booking-hero">
        <Box className="hero-backdrop" sx={{ backgroundImage: `url(${show.moviePosterImage || ''})` }} />
        <Box className="hero-overlay" />
        <Container maxWidth="lg" className="hero-content">
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', mb: 4, bgcolor: 'rgba(255,255,255,0.1)' }}>
            <BackIcon />
          </IconButton>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item>
              {show.moviePosterImage && (
                <Paper sx={{
                  width: isMobile ? 120 : 180,
                  height: isMobile ? 180 : 270,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img src={show.moviePosterImage} alt={show.movieTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Paper>
              )}
            </Grid>
            <Grid item xs>
              <Typography variant="overline" sx={{ color: theme.palette.primary.main, fontWeight: 800, letterSpacing: '0.2em' }}>NOW BOOKING</Typography>
              <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: '-0.04em', lineHeight: 1, mb: 1 }}>{show.movieTitle}</Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>{show.cinemaName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>{showDate}</Typography>
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
                {Array.from({ length: show.totalSeats || 60 }, (_, i) => {
                  const seatNumber = i + 1;
                  const isSelected = selectedSeats.includes(seatNumber);
                  return (
                    <Box
                      key={`seat-${seatNumber}`}
                      onClick={() => handleSeatClick(seatNumber)}
                      className={`seat-box ${isSelected ? 'selected' : ''}`}
                    >
                      {seatNumber}
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
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{show.movieTitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{showTime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Selected Seats</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {selectedSeats.length ? selectedSeats.join(', ') : 'None'}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', py: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Total Price</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                    Rs. {selectedSeats.length * show.showPrice}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!selectedSeats.length}
                  onClick={handlePayment}
                  startIcon={<PaymentIcon />}
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
                  Book Now with Khalti
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
