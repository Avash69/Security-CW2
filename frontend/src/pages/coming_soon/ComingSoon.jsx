
import {
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  LocalMovies as LocalMoviesIcon,
  PlayCircle as PlayCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import './ComingSoon.css';

const movieData = [
  {
    id: 1,
    title: "Superman",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/32/Superman_%282025_film%29_poster.jpg",
    genre: "Action, Adventure, Sci-Fi",
    rating: "PG-13",
    duration: "TBA",
    details: "The new Superman film directed by James Gunn, starring David Corenswet as the Man of Steel. This reboot promises to bring a fresh take on the iconic superhero.",
    releaseDate: "2025-07-11T00:00:00",
    releaseDisplay: "July 11, 2025",
    trailerUrl: "https://youtu.be/Ox8ZLF6cGM0?si=zB7T1b2MpLgVVg3M"
  },
  {
    id: 3,
    title: "Captain America: Brave New World",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7vzaB-s3FhliaRfVRBhZ3mxqkUCga2jxQA&s",
    genre: "Action, Adventure, Thriller",
    rating: "PG-13",
    duration: "118 min",
    details: "Sam Wilson officially takes up the mantle of Captain America and finds himself in the middle of an international incident. Anthony Mackie stars as the new Captain America.",
    releaseDate: "2025-02-14T00:00:00",
    releaseDisplay: "February 14, 2025",
    trailerUrl: "https://youtu.be/1pHDWnXmK7Y?si=QRF5aQEp1J8YG_pd"
  },
  {
    id: 2,
    title: "Fantastic Four: First Steps",
    poster: "https://lumiere-a.akamaihd.net/v1/images/12_blue_teaser2_4x5_ig_2609a9ad.jpeg?region=0,0,1080,1350",
    genre: "Action, Adventure, Sci-Fi",
    rating: "PG-13",
    duration: "TBA",
    details: "Marvel's First Family returns to the big screen in this highly anticipated MCU debut. The film will introduce the Fantastic Four to the Marvel Cinematic Universe.",
    releaseDate: "2025-07-25T00:00:00",
    releaseDisplay: "July 25, 2025",
    trailerUrl: "https://youtu.be/18QQWa5MEcs?si=KX4dqLKZCOvyNjvn"
  },
  {
    id: 10,
    title: "Mission: Impossible - The Final Reckoning",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSafalx_eWYqtyL60gkiDE61XXeEmyeuRBf8g&s",
    genre: "Action, Adventure, Thriller",
    rating: "PG-13",
    duration: "TBA",
    details: "Tom Cruise returns as Ethan Hunt in what promises to be the final Mission: Impossible film. High-octane action and incredible stunts await.",
    releaseDate: "2025-05-23T00:00:00",
    releaseDisplay: "May 23, 2025",
    trailerUrl: "https://youtu.be/fsQgc9pCyDU?si=dSU2WykIwNSVcXNR"
  }
];

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item, index) => (
        <Box key={index} className="countdown-box float-element">
          <Typography className="countdown-value">{String(item.value).padStart(2, '0')}</Typography>
          <Typography className="countdown-label">{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const ComingSoon = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedMovie, setSelectedMovie] = useState(null);

  const featuredMovie = useMemo(() => {
    // Find the one closest to now but in future
    const now = new Date().getTime();
    return movieData
      .filter(m => new Date(m.releaseDate).getTime() > now)
      .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())[0] || movieData[0];
  }, []);

  const handleDetailsClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleWatchTrailer = (trailerUrl) => {
    if (trailerUrl) {
      window.open(trailerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box className="coming-soon-root">
      <Box className="film-grain" />

      {/* Hero Section */}
      <Box sx={{
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 2,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box>
              <Chip
                label="PREMIERING SOON"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  px: 2,
                  mb: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              />
              <Typography variant="h1" sx={{
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '5rem' },
                mb: 2,
                letterSpacing: '-0.04em',
                lineHeight: 1
              }}>
                The Next Big <br />
                <Box component="span" sx={{ color: theme.palette.primary.main }}>Premiere.</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: '#94A3B8', fontWeight: 400, maxWidth: 600, mx: 'auto', mb: 6 }}>
                Witness the future of cinema. Count down to the world's most anticipated blockbusters, exclusively with Movie-Mitra.
              </Typography>

              <Box sx={{ p: 4, borderRadius: 8, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: 800, mx: 'auto' }}>
                <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 800, letterSpacing: '0.1em' }}>
                  FEATURED COUNTDOWN: {featuredMovie.title.toUpperCase()}
                </Typography>
                <CountdownTimer targetDate={featuredMovie.releaseDate} />
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Movies Grid */}
      <Container maxWidth="lg" sx={{ pb: 12, position: 'relative', zIndex: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalMoviesIcon sx={{ color: theme.palette.primary.main }} />
          Coming Soon to Theaters
        </Typography>

        <Grid container spacing={4}>
          {movieData.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.id}>
              <Card className="movie-card-glass">
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={movie.poster}
                    alt={movie.title}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400/020617/64748B?text=Movie+Poster'; }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to top, #020617 0%, transparent 50%)',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <Chip
                      size="small"
                      label={movie.genre.split(',')[0]}
                      sx={{
                        width: 'fit-content',
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: 'white',
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '0.7rem'
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>{movie.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>{movie.releaseDisplay}</Typography>
                  </Box>
                </Box>
                <CardContent sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => handleDetailsClick(movie)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Details
                  </Button>
                  <IconButton
                    onClick={() => handleWatchTrailer(movie.trailerUrl)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      borderRadius: 2,
                      '&:hover': { bgcolor: theme.palette.primary.dark }
                    }}
                  >
                    <PlayCircleIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Premium Detail Pass (Dialog) */}
      <Dialog
        open={Boolean(selectedMovie)}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 6,
            bgcolor: '#0F172A',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        {selectedMovie && (
          <Box>
            <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${selectedMovie.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(40px) brightness(0.5)',
                transform: 'scale(1.2)'
              }} />
              <Box sx={{ position: 'relative', p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: theme.palette.primary.main, letterSpacing: '0.2em' }}>MOVIE PREVIEW</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>{selectedMovie.title}</Typography>
                </Box>
                <IconButton onClick={handleCloseModal} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><CloseIcon /></IconButton>
              </Box>
            </Box>

            <DialogContent sx={{ p: 4, mt: -6 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={selectedMovie.poster} alt={selectedMovie.title} style={{ width: '100%', display: 'block' }} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      <Chip icon={<StarIcon sx={{ color: 'inherit !important' }} />} label={selectedMovie.rating} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontWeight: 700 }} />
                      <Chip icon={<AccessTimeIcon />} label={selectedMovie.duration} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94A3B8' }} />
                      <Chip icon={<CalendarTodayIcon />} label={selectedMovie.releaseDisplay} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94A3B8' }} />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 800, mb: 1 }}>GENRE</Typography>
                      <Typography variant="body1">{selectedMovie.genre}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 800, mb: 1 }}>SYNOPSIS</Typography>
                      <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>{selectedMovie.details}</Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleWatchTrailer(selectedMovie.trailerUrl)}
                      startIcon={<PlayCircleIcon />}
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        fontWeight: 800,
                        boxShadow: '0 10px 20px rgba(25, 118, 210, 0.2)',
                        '&:hover': { transform: 'translateY(-2px)' }
                      }}
                    >
                      WATCH OFFICIAL TRAILER
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default ComingSoon;