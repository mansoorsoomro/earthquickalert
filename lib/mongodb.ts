import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ready2go';

if (MONGODB_URI.startsWith('mongodb+srv://') && !MONGODB_URI.includes('/', 14)) {
    // If it's a sub-domain URI like cluster0.mongodb.net/ (with no DB name)
    // Append the default DB name
    MONGODB_URI = MONGODB_URI.endsWith('/') ? `${MONGODB_URI}ready2go` : `${MONGODB_URI}/ready2go`;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('Connecting to MongoDB...');
        // Obfuscate URI for logging
        const obfuscatedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
        console.log(`Using URI: ${obfuscatedUri}`);

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error('Failed to await MongoDB connection:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
