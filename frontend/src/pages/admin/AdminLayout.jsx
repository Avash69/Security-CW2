import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)'
    }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: 'block', sm: 'none' },
          bgcolor: '#FFFFFF',
          color: '#0F172A',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: '#1976D2', letterSpacing: '-0.02em' }}>
            Movie-Mitra
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Admin Navigation */}
      <AdminNavbar
        mobileOpen={isMobileMenuOpen}
        onMobileClose={toggleMobileMenu}
      />

      {/* Main Content Area */}
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          pt: { xs: 12, sm: 4 },
          mt: 0
        }}
      >
        {/* This will render the matched admin route component */}
        <Box sx={{ ml: { xs: 0, sm: '280px' } }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLayout;
