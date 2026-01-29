import {
  ConfirmationNumber,
  Dashboard,
  ExitToApp,
  Feedback,
  LocalActivity,
  Movie,
  People,
  TheaterComedy,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSingleProfileApi, logoutApi } from '../apis/Api';

const DRAWER_WIDTH = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  {
    text: 'Movies Management',
    icon: <Movie />,
    path: '/admin/movieManagement',
  },
  {
    text: 'Shows Management',
    icon: <TheaterComedy />,
    path: '/admin/showManagement',
  },
  {
    text: 'Bookings Management',
    icon: <ConfirmationNumber />,
    path: '/admin/bookingsManagement',
  },
  {
    text: 'Customers Management',
    icon: <People />,
    path: '/admin/customerManagement',
  },
  { text: 'User Feedbacks', icon: <Feedback />, path: '/admin/userFeedbacks' },
  {
    text: 'Log Management',
    icon: <LocalActivity />,
    path: '/admin/activityLogs',
  },
];

const AdminNavbar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await getSingleProfileApi();
        setAdmin(response.data.user);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = () => {
    logoutApi()
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true, state: { from: location } });
      })
      .catch((error) => { });
  };

  const drawerContent = (
    <Stack sx={{ height: '100%', bgcolor: '#FFFFFF' }}>
      {/* Sidebar Header */}
      <Box sx={{ p: 4, pb: 2 }}>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 800,
            color: '#1976D2',
            letterSpacing: '-0.02em',
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
          Movie-Mitra
          <Box component="span" sx={{ fontSize: '0.6em', bgcolor: '#E3F2FD', color: '#1976D2', px: 1, py: 0.5, borderRadius: 1 }}>AD</Box>
        </Typography>
        <Typography
          variant='body2'
          sx={{ color: '#64748B', fontWeight: 500 }}>
          Central Control Hub
        </Typography>
      </Box>

      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Box sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: '#F8FAFC',
          border: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            {admin?.username?.charAt(0).toUpperCase() || 'A'}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {admin?.username || 'Admin User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              System Operator
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
        <Typography variant="caption" sx={{ px: 2, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
          Main Menu
        </Typography>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (onMobileClose) onMobileClose();
              }}
              selected={active}
              sx={{
                my: 0.8,
                py: 1.2,
                px: 2,
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: '#1976D2',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    bgcolor: '#1565C0',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                  '& .MuiTypography-root': {
                    color: 'inherit',
                    fontWeight: 700
                  }
                },
                '&:hover:not(.Mui-selected)': {
                  bgcolor: '#F1F5F9',
                  '& .MuiListItemIcon-root': {
                    color: '#1976D2',
                  },
                }
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: active ? 'inherit' : '#64748B',
                  transition: 'color 0.2s ease',
                }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 600,
                    color: active ? 'inherit' : '#475569',
                  }
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            color: '#EF4444',
            bgcolor: '#FEF2F2',
            '&:hover': {
              bgcolor: '#FEE2E2',
              color: '#DC2626'
            }
          }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary='Exit Terminal'
            sx={{ '& .MuiTypography-root': { fontWeight: 700, fontSize: '0.9rem' } }}
          />
        </ListItemButton>
      </Box>
    </Stack>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            borderRight: 'none',
            boxShadow: '8px 0 24px rgba(0,0,0,0.1)'
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #E2E8F0',
            boxShadow: '4px 0 12px rgba(0,0,0,0.02)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AdminNavbar;
