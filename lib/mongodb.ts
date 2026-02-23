import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ready2go';

try {
    if (MONGODB_URI && MONGODB_URI.startsWith('mongodb+srv://')) {
        const url = new URL(MONGODB_URI);
        if (!url.pathname || url.pathname === '/') {
            url.pathname = '/ready2go';
            MONGODB_URI = url.toString();
        }
    }
} catch (err) {
    console.error('Error parsing MONGODB_URI:', err);
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
