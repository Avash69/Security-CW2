
const mongoose = require('mongoose');
const fs = require('fs');

const mongoUri = 'mongodb://localhost:27017/Movie_Ticketing_System';

async function inspectData() {
    let log = '';
    const appendLog = (msg) => { log += msg + '\n'; console.log(msg); };

    try {
        await mongoose.connect(mongoUri);
        appendLog('Connected to MongoDB');

        const Movie = mongoose.models.movies || mongoose.model("movies", new mongoose.Schema({ movieName: String }, { strict: false }));
        const Show = mongoose.models.Show || mongoose.model('Show', new mongoose.Schema({ movieId: mongoose.Schema.Types.ObjectId }, { strict: false }));

        const shows = await Show.find().lean();
        appendLog(`\n--- ALL SHOWS (${shows.length}) ---`);
        for (const show of shows) {
            appendLog(`Show ID: ${show._id}`);
            appendLog(`Movie ID Ref: ${show.movieId}`);

            const movie = await Movie.findById(show.movieId).lean();
            if (movie) {
                appendLog(`Linked Movie Name: ${movie.movieName}`);
            } else {
                appendLog(`Linked Movie NOT FOUND for ID: ${show.movieId}`);
            }
            appendLog(`Date: ${show.showDate}`);
            appendLog(`Time: ${show.showTime}`);
            appendLog('------------------');
        }

        const movies = await Movie.find().lean();
        appendLog(`\n--- ALL MOVIES (${movies.length}) ---`);
        for (const movie of movies) {
            appendLog(`Movie: ${movie.movieName}, ID: ${movie._id}`);
        }

        fs.writeFileSync('db_inspection_result.txt', log);
        appendLog('\nResults saved to db_inspection_result.txt');
        await mongoose.disconnect();
    } catch (err) {
        appendLog('Error: ' + err);
    }
}

inspectData();
