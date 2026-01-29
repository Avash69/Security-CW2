import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  addShowsApi,
  createMovieApi,
  deleteMovieApi,
  getAllMoviesApi,
} from '../../../apis/Api';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [openAddMovie, setOpenAddMovie] = useState(false);
  const [openAddShow, setOpenAddShow] = useState(false);
  const [movieForShow, setMovieForShow] = useState(null);

  const [formData, setFormData] = useState({
    movieName: '',
    movieGenre: '',
    movieDetails: '',
    movieRated: '',
    movieDuration: '',
    moviePosterImage: null,
    previewPosterImage: null,
  });

  const [showData, setShowData] = useState({
    showDate: '',
    showTime: '',
    showPrice: 0,
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    getAllMoviesApi()
      .then((res) => setMovies(res.data.movies))
      .catch((error) => {
        toast.error('Failed to load movies');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        moviePosterImage: file,
        previewPosterImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'previewPosterImage') {
        formDataToSend.append(key, formData[key]);
      }
    });

    createMovieApi(formDataToSend)
      .then((res) => {
        if (res.status === 201) {
          toast.success('Movie created successfully');
          setOpenAddMovie(false);
          fetchMovies();
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Failed to create movie');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovieApi(id)
        .then((res) => {
          toast.success('Movie deleted');
          fetchMovies();
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Failed to delete');
        });
    }
  };

  const handleAddShow = (e) => {
    e.preventDefault();
    const data = {
      ...showData,
      movieId: movieForShow._id,
    };

    addShowsApi(data)
      .then((res) => {
        toast.success('Show added successfully');
        setOpenAddShow(false);
      })
      .catch((err) => {
        toast.error(err.response?.data.message || 'Failed to add show');
      });
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ pb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 6,
            bgcolor: 'white',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Movie Management
            </Typography>
            <Typography variant='body2' sx={{ color: '#64748B', fontWeight: 600 }}>
              Curate and manage your ultimate movie library.
            </Typography>
          </Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setOpenAddMovie(true)}
            sx={{
              bgcolor: '#1976D2',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              borderRadius: 3,
              '&:hover': {
                bgcolor: '#1565C0',
                transform: 'scale(1.02)'
              },
              transition: 'all 0.2s'
            }}>
            New Movie
          </Button>
        </Paper>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 6,
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Poster</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Genre</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Rated</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Duration</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow
                  key={movie._id}
                  sx={{ '&:hover': { bgcolor: '#F1F5F9' }, transition: 'background-color 0.2s' }}
                >
                  <TableCell>
                    <img
                      src={`https://localhost:5000/movies/${movie.moviePosterImage}`}
                      alt={movie.movieName}
                      style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {movie.movieName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={movie.movieGenre}
                      size="small"
                      sx={{ bgcolor: '#E3F2FD', color: '#1976D2', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={movie.movieRated}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700, borderColor: '#CBD5E1' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600 }}>{movie.movieDuration}</TableCell>
                  <TableCell align="right">
                    <Box display='flex' gap={1} justifyContent="flex-end">
                      <Tooltip title="Add Show">
                        <IconButton
                          onClick={() => {
                            setMovieForShow(movie);
                            setOpenAddShow(true);
                          }}
                          sx={{ color: '#10B981', bgcolor: '#F0FDF4', '&:hover': { bgcolor: '#DCFCE7' } }}
                        >
                          <EventNoteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Movie">
                        <IconButton
                          component={Link}
                          to={`/admin/update/${movie._id}`}
                          sx={{ color: '#1976D2', bgcolor: '#EFF6FF', '&:hover': { bgcolor: '#DBEAFE' } }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Movie">
                        <IconButton
                          onClick={() => handleDelete(movie._id)}
                          sx={{ color: '#EF4444', bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Movie Dialog */}
        <Dialog
          open={openAddMovie}
          onClose={() => setOpenAddMovie(false)}
          maxWidth='sm'
          fullWidth
          PaperProps={{ sx: { borderRadius: 6, p: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 0 }}>Create New Movie</DialogTitle>
          <DialogContent>
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField fullWidth label='Movie Name' name='movieName' value={formData.movieName} onChange={handleInputChange} margin='normal' required />
              <TextField fullWidth label='Movie Genre' name='movieGenre' value={formData.movieGenre} onChange={handleInputChange} margin='normal' required />
              <TextField fullWidth label='Movie Details' name='movieDetails' value={formData.movieDetails} onChange={handleInputChange} margin='normal' multiline rows={3} required />
              <FormControl fullWidth margin='normal'>
                <InputLabel>Movie Rating</InputLabel>
                <Select name='movieRated' value={formData.movieRated} onChange={handleInputChange} required>
                  <MenuItem value='G'>G (General)</MenuItem>
                  <MenuItem value='PG'>PG (Parental Guidance)</MenuItem>
                  <MenuItem value='PG-13'>PG-13</MenuItem>
                  <MenuItem value='R'>R (Restricted)</MenuItem>
                  <MenuItem value='NR'>NR (Not Rated)</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label='Movie Duration' name='movieDuration' value={formData.movieDuration} onChange={handleInputChange} margin='normal' placeholder="e.g. 2h 30m" required />
              <TextField fullWidth type='file' onChange={handlePosterImage} margin='normal' required InputLabelProps={{ shrink: true }} label="Movie Poster" />
              {formData.previewPosterImage && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img src={formData.previewPosterImage} alt='preview' style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddMovie(false)} sx={{ fontWeight: 600, color: '#64748B' }}>Cancel</Button>
            <Button onClick={handleSubmit} variant='contained' sx={{ fontWeight: 700, borderRadius: 3, px: 4 }}>Save Movie</Button>
          </DialogActions>
        </Dialog>

        {/* Add Show Dialog */}
        <Dialog
          open={openAddShow}
          onClose={() => setOpenAddShow(false)}
          PaperProps={{ sx: { borderRadius: 6, p: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 0 }}>Add Show Configuration</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 2 }}>
              Configuring show for: <strong>{movieForShow?.movieName}</strong>
            </Typography>
            <Box component='form' onSubmit={handleAddShow} sx={{ mt: 2 }}>
              <TextField fullWidth type='date' label='Show Date' value={showData.showDate} onChange={(e) => setShowData((prev) => ({ ...prev, showDate: e.target.value }))} margin='normal' required InputLabelProps={{ shrink: true }} />
              <TextField fullWidth type='time' label='Show Time' value={showData.showTime} onChange={(e) => setShowData((prev) => ({ ...prev, showTime: e.target.value }))} margin='normal' required InputLabelProps={{ shrink: true }} />
              <TextField fullWidth type='number' label='Ticket Price (NPR)' value={showData.showPrice} onChange={(e) => setShowData((prev) => ({ ...prev, showPrice: e.target.value }))} margin='normal' required />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddShow(false)} sx={{ fontWeight: 600, color: '#64748B' }}>Cancel</Button>
            <Button onClick={handleAddShow} variant='contained' color="success" sx={{ fontWeight: 700, borderRadius: 3, px: 4 }}>Create Show</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default MovieManagement;
