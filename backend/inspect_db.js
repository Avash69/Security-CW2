
const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/Movie_Ticketing_System';

async function inspectData() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const Movie = mongoose.model('movies', new mongoose.Schema({}, { strict: false }));
        const Show = mongoose.model('Show', new mongoose.Schema({}, { strict: false }));

        const movieCount = await Movie.countDocuments({});
        const showCount = await Show.countDocuments({});

        console.log(`Total Movies: ${movieCount}`);
        console.log(`Total Shows: ${showCount}`);

        if (showCount > 0) {
            const shows = await Show.find().limit(5);
            console.log('--- SAMPLE SHOWS ---');
            shows.forEach(s => {
                console.log(`Show ID: ${s._id}, MovieID Reference: ${s.movieId}, Date: ${s.showDate}, Time: ${s.showTime}`);
            });
        }

        if (movieCount > 0) {
            const movies = await Movie.find().limit(5);
            console.log('--- SAMPLE MOVIES ---');
            movies.forEach(m => {
                console.log(`Movie ID: ${m._id}, Name: ${m.movieName}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

inspectData();
