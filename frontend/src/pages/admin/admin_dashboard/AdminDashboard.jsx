import {
  EventSeat as EventSeatIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboardStatsApi } from '../../../apis/Api';

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
        }
      }}>
      <CardContent sx={{ p: 3 }}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
          <Box>
            <Typography
              variant='subtitle2'
              sx={{
                color: '#64748B',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                mb: 1
              }}>
              {title}
            </Typography>
            <Typography
              variant='h3'
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em'
              }}>
              {value.toLocaleString()}
            </Typography>
            {trend && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                  ↑ {trend}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUserLogins: 0,
    totalMoviesAdded: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStatsApi();
      if (response.status === 200) {
        setStats(response.data);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Users', value: stats.totalUserLogins, color: '#1976D2' },
    { name: 'Movies', value: stats.totalMoviesAdded, color: '#10B981' },
    { name: 'Bookings', value: stats.totalBookings, color: '#F59E0B' },
  ];

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='60vh'>
        <CircularProgress size={40} thickness={4} sx={{ color: '#1976D2' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Grid container spacing={4}>
        {/* Welcome Hero Banner */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 6,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1E40AF 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(30, 64, 175, 0.15)',
            }}>
            {/* Background pattern */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(40px)'
            }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant='h3' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.03em' }}>
                Dashboard Overview
              </Typography>
              <Typography variant='h6' sx={{ opacity: 0.9, fontWeight: 500, mb: 4, maxWidth: '600px' }}>
                Welcome back, Admin! Here's what's happening at Movie-Mitra today. Manage your cinema empire with ease.
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchStats}
                sx={{
                  bgcolor: 'white',
                  color: '#1976D2',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                    transform: 'scale(1.02)'
                  },
                  transition: 'all 0.2s'
                }}>
                Refresh Statistics
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title='Total Platform Users'
            value={stats.totalUserLogins}
            icon={PeopleIcon}
            color='#1976D2'
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title='Active Movie Library'
            value={stats.totalMoviesAdded}
            icon={MovieIcon}
            color='#10B981'
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title='Confirmed Bookings'
            value={stats.totalBookings}
            icon={EventSeatIcon}
            color='#F59E0B'
            trend={8}
          />
        </Grid>

        {/* Analytics Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 6,
              bgcolor: 'white',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant='h5' sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  System Analytics
                </Typography>
                <Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
                  Growth metrics spanning across users, content, and transactions.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontWeight: 600, fontSize: 13 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontWeight: 600, fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontWeight: 700
                    }}
                  />
                  <Bar
                    dataKey='value'
                    radius={[8, 8, 0, 0]}
                    barSize={60}
                  >
                    {chartData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
