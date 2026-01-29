
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LocalMovies as LocalMoviesIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';
import { registerUserApi, verifyRegisterOtpApi } from '../../apis/Api';
import VerificationModal from '../../components/VerificationModel';
import loginHero from '../../assets/login_hero.png';

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openRegisterVerificationModal, setOpenRegisterVerificationModal] = useState(false);

  const handleRegisterVerification = (otpString) => {
    verifyRegisterOtpApi({ email, otp: otpString })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/homepage';
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Verification failed');
      });
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });

    if (field === 'password') {
      const strength = zxcvbn(value);
      setPasswordStrength({
        score: strength.score,
        feedback: strength.feedback.suggestions.join(' ') || 'Strong password!',
      });
    }

    if (field === 'email') {
      setEmail(value);
    }
  };

  const togglePasswordVisibility = (field) => () => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters';
      isValid = false;
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak.';
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const data = {
      username: formData.username,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
    };
    try {
      const res = await registerUserApi(data);
      if (res.status === 201) {
        toast.success(res.data.message);
        setOpenRegisterVerificationModal(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 0: return '#ff4436';
      case 1: return '#ffa000';
      case 2: return '#ffd600';
      case 3: return '#52c41a';
      case 4: return '#00c853';
      default: return '#e0e0e0';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
      p: { xs: 2, md: 4 }
    }}>
      <Fade in timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 1000,
            borderRadius: 6,
            overflow: 'hidden',
            display: 'flex',
            bgcolor: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E2E8F0',
          }}
        >
          <Grid container>
            {/* Left Side: Hero (contained) */}
            {!isMobile && (
              <Grid item md={5} sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${loginHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(25, 118, 210, 0.1), rgba(15, 23, 42, 0.3))',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'white'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalMoviesIcon sx={{ fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                      Movie-Mitra
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                      Join the Fun.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Unlock exclusive movie deals and real-time updates.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Right Side: Register Form */}
            <Grid item xs={12} md={7} sx={{ p: { xs: 4, sm: 6, md: 8 }, overflowY: 'auto' }}>
              <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1, letterSpacing: '-0.02em' }}>
                    New Account
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                    Create your profile to start booking tickets.
                  </Typography>
                </Box>

                <Box component='form' onSubmit={handleSubmit} noValidate>
                  <Stack spacing={0}>
                    <TextField
                      fullWidth
                      label='Full Name'
                      variant="outlined"
                      margin="normal"
                      size="small"
                      error={!!errors.username}
                      helperText={errors.username}
                      value={formData.username}
                      onChange={handleChange('username')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <PersonIcon color="primary" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Phone'
                      variant="outlined"
                      margin="normal"
                      size="small"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                      value={formData.phoneNumber}
                      onChange={handleChange('phoneNumber')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <PhoneIcon color="primary" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Email'
                      variant="outlined"
                      margin="normal"
                      size="small"
                      error={!!errors.email}
                      helperText={errors.email}
                      value={formData.email}
                      onChange={handleChange('email')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <EmailIcon color="primary" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Password'
                      type={showPassword.password ? 'text' : 'password'}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      error={!!errors.password}
                      helperText={errors.password}
                      value={formData.password}
                      onChange={handleChange('password')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LockIcon color="primary" fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={togglePasswordVisibility('password')} edge='end'>
                              {showPassword.password ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {formData.password && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={(passwordStrength.score + 1) * 20}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#E2E8F0',
                            '& .MuiLinearProgress-bar': { backgroundColor: getStrengthColor(passwordStrength.score) },
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label='Confirm Password'
                      type={showPassword.confirmPassword ? 'text' : 'password'}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      value={formData.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F8FAFC' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LockIcon color="primary" fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={togglePasswordVisibility('confirmPassword')} edge='end'>
                              {showPassword.confirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    disabled={isLoading}
                    sx={{
                      mt: 3,
                      mb: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 3,
                      bgcolor: '#1976D2',
                      boxShadow: '0 10px 20px rgba(25, 118, 210, 0.15)',
                      '&:hover': {
                        bgcolor: '#1565C0',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px rgba(25, 118, 210, 0.25)',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                    {isLoading ? 'Processing...' : 'Create Account'}
                  </Button>

                  <Box sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#F8FAFC',
                    border: '1px solid #F1F5F9'
                  }}>
                    <Typography variant='body2' sx={{ color: '#64748B', fontWeight: 600 }}>
                      Already have an account?{' '}
                      <Link to='/login' style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 800 }}>
                        Login
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      <VerificationModal
        open={openRegisterVerificationModal}
        onClose={() => setOpenRegisterVerificationModal(false)}
        isRegistration={true}
        onVerify={handleRegisterVerification}
        email={email}
      />
    </Box>
  );
};

export default Register;
