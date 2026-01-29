
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
  alpha,
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
      newErrors.password = 'Password must contain at least 8 characters with letters and numbers';
      isValid = false;
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak. Please choose a stronger password.';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#FFFFFF' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side: Hero Illustration */}
        {!isMobile && (
          <Grid item md={6} lg={7} sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${loginHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.2) 0%, rgba(15, 23, 42, 0.4) 100%)',
                }
              }}
            />
            <Box sx={{ position: 'absolute', top: 40, left: 40, zIndex: 10 }}>
              <Typography variant="h4" sx={{
                fontWeight: 900,
                color: 'white',
                letterSpacing: '-0.03em',
                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LocalMoviesIcon sx={{ fontSize: 40 }} />
                Movie-Mitra
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 60, left: 60, right: 60, zIndex: 10 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 2, letterSpacing: '-0.04em', lineHeight: 1 }}>
                Join the Circle of<br />Cinematic Magic.
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, fontWeight: 400, maxWidth: 500 }}>
                Experience movies like never before. Real-time bookings, exclusive offers, and an immersive community await.
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Right Side: Registration Form */}
        <Grid item xs={12} md={6} lg={5} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          position: 'relative',
          py: 4
        }}>
          {isMobile && (
            <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1976D2', letterSpacing: '-0.02em' }}>
                Movie-Mitra
              </Typography>
            </Box>
          )}

          <Fade in timeout={1000}>
            <Container maxWidth="xs" sx={{ px: { xs: 3, sm: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1, letterSpacing: '-0.02em' }}>
                  Create Account
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
                  Start your journey into the world of cinema.
                </Typography>
              </Box>

              <Box component='form' onSubmit={handleSubmit} noValidate>
                <Stack spacing={0.5}>
                  <TextField
                    fullWidth
                    label='Full Name'
                    variant="outlined"
                    margin="normal"
                    error={!!errors.username}
                    helperText={errors.username}
                    value={formData.username}
                    onChange={handleChange('username')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PersonIcon color={errors.username ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label='Phone Number'
                    variant="outlined"
                    margin="normal"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    value={formData.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PhoneIcon color={errors.phoneNumber ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label='Email Address'
                    type='email'
                    variant="outlined"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                    value={formData.email}
                    onChange={handleChange('email')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <EmailIcon color={errors.email ? 'error' : 'primary'} />
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
                    error={!!errors.password}
                    helperText={errors.password}
                    value={formData.password}
                    onChange={handleChange('password')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockIcon color={errors.password ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={togglePasswordVisibility('password')} edge='end'>
                            {showPassword.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': { backgroundColor: getStrengthColor(passwordStrength.score) },
                        }}
                      />
                      <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: getStrengthColor(passwordStrength.score), fontWeight: 700 }}>
                        {passwordStrength.feedback}
                      </Typography>
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    label='Confirm Password'
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockIcon color={errors.confirmPassword ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={togglePasswordVisibility('confirmPassword')} edge='end'>
                            {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                    mt: 4,
                    mb: 3,
                    py: 1.8,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 3,
                    bgcolor: '#1976D2',
                    boxShadow: '0 10px 20px rgba(25, 118, 210, 0.2)',
                    '&:hover': {
                      bgcolor: '#1565C0',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 24px rgba(25, 118, 210, 0.3)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                  {isLoading ? 'Creating Account' : 'Join Movie-Mitra'}
                </Button>

                <Box sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#F1F5F9',
                  border: '1px solid #E2E8F0'
                }}>
                  <Typography variant='body2' sx={{ color: '#475569', fontWeight: 600 }}>
                    Already have an account?{' '}
                    <Link to='/login' style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 800 }}>
                      Log In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Container>
          </Fade>
        </Grid>
      </Grid>

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
