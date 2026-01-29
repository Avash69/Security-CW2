import {
  Box,
  Container,
  Divider,
  Link,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'none',
  },
}));

const Footer = () => {
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.isAdmin) {
    return null;
  }

  return (
    <Box
      component='footer'
      sx={{
        bgcolor: '#F1F5F9',
        py: 8,
        mt: 'auto',
        borderTop: '1px solid #E2E8F0',
      }}>
      <Container maxWidth='lg'>
        <Stack
          spacing={4}
          alignItems='center'>
          {/* Navigation Links */}
          <Stack
            direction='row'
            spacing={4}
            justifyContent='center'
            divider={
              <Divider
                orientation='vertical'
                flexItem
                sx={{ bgcolor: '#CBD5E1' }}
              />
            }>
            <Link
              component={StyledLink}
              to='/aboutUs'
              variant='subtitle1'
              sx={{ color: '#475569', '&:hover': { color: '#1976D2' }, fontWeight: 500 }}>
              About Us
            </Link>
            <Link
              component={StyledLink}
              to='/contactUs'
              variant='subtitle1'
              sx={{ color: '#475569', '&:hover': { color: '#1976D2' }, fontWeight: 500 }}>
              Contact Us
            </Link>
          </Stack>

          {/* Logo and Company Name */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h4'
              component='h1'
              sx={{
                color: '#1976D2',
                fontWeight: 800,
                mb: 1,
                letterSpacing: '-0.02em',
              }}>
              FilmSathi
            </Typography>
            <Box sx={{ width: 40, h: 4, bgcolor: '#1976D2', mx: 'auto', borderRadius: 2 }} />
          </Box>

          {/* Tagline */}
          <Typography
            variant='subtitle1'
            color='#64748B'
            align='center'
            sx={{ maxWidth: 'sm', mx: 'auto', fontWeight: 500 }}>
            Bringing the magic of movies to life.
            <br />
            Enjoy the ultimate cinematic experience with us.
          </Typography>

          {/* Copyright */}
          <Typography
            variant='body2'
            color='#94A3B8'
            align='center'
            sx={{ mt: 2 }}>
            © {new Date().getFullYear()} FilmSathi. Professional Cinema Booking.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
