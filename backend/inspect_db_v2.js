
const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/Movie_Ticketing_System';

async function inspectData() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const Movie = mongoose.model('movies', new mongoose.Schema({}, { strict: false }));
        const Show = mongoose.model('Show', new mongoose.Schema({}, { strict: false }));

        const shows = await Show.find().lean();
        console.log(`Total Shows in DB: ${shows.length}`);

        for (const show of shows) {
            console.log('--- SHOW ---');
            console.log(`ID: ${show._id}`);
            console.log(`MovieID Ref: ${show.movieId}`);
            console.log(`Date: ${show.showDate}`);
            console.log(`Time: ${show.showTime}`);

            const movie = await Movie.findById(show.movieId).lean();
            if (movie) {
                console.log(`Linked Movie Name: ${movie.movieName}`);
            } else {
                console.log(`Linked Movie NOT FOUND for ID: ${show.movieId}`);
            }
        }

        const movies = await Movie.find().lean();
        console.log(`\nTotal Movies in DB: ${movies.length}`);
        for (const movie of movies) {
            console.log(`Movie: ${movie.movieName}, ID: ${movie._id}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

inspectData();
