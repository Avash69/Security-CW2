
import {
  Email as EmailIcon,
  LocalMovies as LocalMoviesIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn';
import { Link } from 'react-router-dom';

import {
  forgotPasswordApi,
  loginUserApi,
  resetPasswordApi,
  verifyLoginOtpApi,
  verifyRegisterOtpApi,
} from '../../apis/Api';
import VerificationModal from '../../components/VerificationModel';
import loginHero from '../../assets/login_hero.png';

const PasswordStrengthIndicator = ({ password }) => {
  const theme = useTheme();
  const result = useMemo(() => zxcvbn(password), [password]);

  const strengthColor = useMemo(() => {
    switch (result.score) {
      case 0: return '#ff4436';
      case 1: return '#ffa000';
      case 2: return '#ffd600';
      case 3: return '#52c41a';
      case 4: return '#00c853';
      default: return '#e0e0e0';
    }
  }, [result.score]);

  const strengthText = useMemo(() => {
    switch (result.score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }, [result.score]);

  return (
    <>
      <Box sx={{ width: '100%', mb: 1 }}>
        <Box
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.grey[300], 0.3),
            overflow: 'hidden',
          }}>
          <Box
            sx={{
              height: '100%',
              width: `${((result.score + 1) / 5) * 100}%`,
              backgroundColor: strengthColor,
              transition: 'all 0.3s ease',
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='caption' sx={{ color: strengthColor, fontWeight: 700 }}>
          {strengthText}
        </Typography>
        {result.feedback.warning && (
          <Typography variant='caption' color='text.secondary'>
            {result.feedback.warning}
          </Typography>
        )}
      </Box>
    </>
  );
};

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSentOtp, setIsSentOtp] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [openRegisterVerificationModal, setOpenRegisterVerificationModal] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleVerification = (otpString) => {
    verifyLoginOtpApi({ email, otp: otpString })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/homepage';
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Verification failed');
      });
  };

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

  const validate = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (resetPassword !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }
    const strength = zxcvbn(resetPassword);
    if (strength.score < 2) {
      toast.warning('Please choose a stronger password');
      return;
    }
    setIsLoading(true);
    try {
      await resetPasswordApi({ email: resetEmail, otp, password: resetPassword });
      toast.success('Password reset successfully');
      setResetEmail('');
      setOtp('');
      setResetPassword('');
      setConfirmPassword('');
      setIsSentOtp(false);
      setShowForgotPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const sentOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.warning('Please enter your email');
      return;
    }
    setIsLoading(true);
    try {
      const res = await forgotPasswordApi({ email: resetEmail });
      toast.success(res.data.message);
      setIsSentOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP send failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }
    setIsLoading(true);
    try {
      loginUserApi({ email, password, captchaToken })
        .then((res) => {
          if (res.data.registerOtpRequired) {
            setOpenRegisterVerificationModal(true);
          } else if (res.data.otpRequired) {
            setOpenVerificationModal(true);
          } else {
            toast.success(res.data.message);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/homepage';
          }
        })
        .catch((err) => {
          if (err.response?.data?.message?.includes('captcha')) {
            toast.error('CAPTCHA verification failed. Please try again.');
            setCaptchaToken(null);
            window.grecaptcha?.reset();
          } else {
            toast.error(err.response?.data?.message || 'Login failed');
          }
        });
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#FFFFFF' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side: Hero Illustration (hidden on mobile) */}
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
            {/* Logo/Branding on Image */}
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
                Cinematic Experiences,<br />Simplified.
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, fontWeight: 400, maxWidth: 500 }}>
                Book tickets, discover new releases, and manage your cinema journey with Nepal's premier platform.
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Right Side: Login Form */}
        <Grid item xs={12} md={6} lg={5} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          position: 'relative',
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
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
                  Enter your credentials to access your terminal.
                </Typography>
              </Box>

              <Card elevation={0} sx={{
                bgcolor: 'transparent',
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box component='form' onSubmit={handleSubmit} noValidate>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin='normal'
                      required
                      label='Email Address'
                      autoComplete='email'
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!emailError}
                      helperText={emailError}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: 'white',
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <EmailIcon color={emailError ? 'error' : 'primary'} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      variant="outlined"
                      margin='normal'
                      required
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!passwordError}
                      helperText={passwordError}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: 'white',
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LockIcon color={passwordError ? 'error' : 'primary'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge='end'
                              size='large'>
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ReCAPTCHA
                        sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                        onChange={(token) => setCaptchaToken(token)}
                        onExpired={() => setCaptchaToken(null)}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        onClick={() => setShowForgotPasswordModal(true)}
                        sx={{ textTransform: 'none', fontWeight: 600, color: '#1976D2' }}>
                        Forgot Password?
                      </Button>
                    </Box>

                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      disabled={isLoading || !captchaToken}
                      sx={{
                        mt: 3,
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
                      {isLoading ? 'Processing...' : 'Login to Account'}
                    </Button>

                    <Box sx={{
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 3,
                      bgcolor: '#F1F5F9',
                      border: '1px solid #E2E8F0'
                    }}>
                      <Typography variant='body2' sx={{ color: '#475569', fontWeight: 600 }}>
                        Don't have an account?{' '}
                        <Link to='/register' style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 800 }}>
                          Sign Up Free
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Container>
          </Fade>
        </Grid>
      </Grid>

      {/* Auth Modals */}
      <VerificationModal
        open={openRegisterVerificationModal}
        onClose={() => setOpenRegisterVerificationModal(false)}
        isRegistration={true}
        onVerify={handleRegisterVerification}
        email={email}
      />

      <VerificationModal
        open={openVerificationModal}
        onClose={() => setOpenVerificationModal(false)}
        isRegistration={false}
        onVerify={handleVerification}
        email={email}
      />

      <Dialog
        open={showForgotPasswordModal}
        onClose={() => !isLoading && setShowForgotPasswordModal(false)}
        PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 400, p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, color: '#0F172A' }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Box component='form' noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label='Registered Email'
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={isSentOtp}
              margin="normal"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {!isSentOtp ? (
              <Button fullWidth variant='contained' onClick={sentOtp} disabled={isLoading} sx={{ mt: 2, py: 1.5, borderRadius: 3, fontWeight: 700 }}>
                {isLoading ? 'Sending...' : 'Request OTP'}
              </Button>
            ) : (
              <>
                <TextField fullWidth label='OTP' type='number' value={otp} onChange={(e) => setOtp(e.target.value)} margin="normal" sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <TextField fullWidth label='New Password' type='password' value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} margin="normal" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                {resetPassword && <Box sx={{ mt: 1 }}><PasswordStrengthIndicator password={resetPassword} /></Box>}
                <TextField fullWidth label='Confirm New Password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setShowForgotPasswordModal(false)} sx={{ fontWeight: 600, color: '#64748B' }}>Cancel</Button>
          {isSentOtp && <Button onClick={handleReset} variant='contained' disabled={isLoading} sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}>Update Password</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
