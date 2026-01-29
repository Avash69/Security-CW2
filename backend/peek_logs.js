
const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/Movie_Ticketing_System';

async function getLogs() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const Log = mongoose.model('Log', new mongoose.Schema({
            level: String,
            message: String,
            method: String,
            url: String,
            user: String,
            ip: String,
            error: String,
            timestamp: Date
        }));

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const logs = await Log.find({ timestamp: { $gte: fiveMinutesAgo } }).sort({ timestamp: -1 });

        console.log('--- LATEST LOGS ---');
        logs.forEach(log => {
            console.log(`[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message}`);
            if (log.error) console.log(` Error: ${log.error}`);
            console.log(` Context: ${log.method} ${log.url} by ${log.user} from ${log.ip}`);
            console.log('-------------------');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

getLogs();
