
const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/Movie_Ticketing_System';

async function inspectData() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Define schemas to avoid errors if they aren't registered
        const movieSchema = new mongoose.Schema({
            movieName: String
        });
        const Movie = mongoose.models.movies || mongoose.model("movies", movieSchema);

        const showSchema = new mongoose.Schema({
            movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'movies' },
            showDate: Date,
            showTime: String,
            showPrice: Number
        });
        const Show = mongoose.models.Show || mongoose.model('Show', showSchema);

        const shows = await Show.find().populate('movieId').lean();
        console.log(`\n--- ALL SHOWS (${shows.length}) ---`);
        for (const show of shows) {
            console.log(`Show ID: ${show._id}`);
            console.log(`Movie ID Ref: ${show.movieId ? show.movieId._id : 'NULL (Ref: ' + show.movieId + ')'}`);
            if (show.movieId && typeof show.movieId === 'object') {
                console.log(`Movie Name: ${show.movieId.movieName}`);
            } else {
                console.log(`Movie Name: NOT POPULATED`);
            }
            console.log(`Date/Time: ${show.showDate} / ${show.showTime}`);
            console.log('------------------');
        }

        const movies = await Movie.find().lean();
        console.log(`\n--- ALL MOVIES (${movies.length}) ---`);
        for (const movie of movies) {
            console.log(`Movie: ${movie.movieName}, ID: ${movie._id}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

inspectData();
