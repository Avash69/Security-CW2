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
        bgcolor: '#050B18',
        py: 8,
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
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
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
              />
            }>
            <Link
              component={StyledLink}
              to='/aboutUs'
              variant='subtitle1'
              sx={{ color: '#94A3B8', '&:hover': { color: '#FFC107' } }}>
              About Us
            </Link>
            <Link
              component={StyledLink}
              to='/contactUs'
              variant='subtitle1'
              sx={{ color: '#94A3B8', '&:hover': { color: '#FFC107' } }}>
              Contact Us
            </Link>
          </Stack>

          {/* Logo and Company Name */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h4'
              component='h1'
              sx={{
                background: 'linear-gradient(135deg, #FFC107 0%, #FFF59D 100%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                mb: 2,
                letterSpacing: '1px',
              }}>
              FilmSathi
            </Typography>
          </Box>

          {/* Tagline */}
          <Typography
            variant='subtitle1'
            color='#94A3B8'
            align='center'
            sx={{ maxWidth: 'sm', mx: 'auto', opacity: 0.8 }}>
            Bringing the magic of movies to life.
            <br />
            Enjoy the ultimate cinematic experience with us.
          </Typography>

          {/* Copyright */}
          <Typography
            variant='body2'
            color='#64748B'
            align='center'
            sx={{ mt: 2 }}>
            © {new Date().getFullYear()} FilmSathi. Premium Cinema Experience.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
