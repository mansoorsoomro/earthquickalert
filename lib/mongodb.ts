import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

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

    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local or your deployment settings'
        );
    }

    let connectionString = MONGODB_URI;

    try {
        if (connectionString.startsWith('mongodb+srv://')) {
            const url = new URL(connectionString);
            if (!url.pathname || url.pathname === '/') {
                url.pathname = '/ready2go';
                connectionString = url.toString();
            }
        }
    } catch (err) {
        console.error('Error parsing MONGODB_URI:', err);
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('Connecting to MongoDB...');
        // Obfuscate URI for logging
        const obfuscatedUri = connectionString.replace(/:([^@]+)@/, ':****@');
        console.log(`Using URI: ${obfuscatedUri}`);

        cached.promise = mongoose.connect(connectionString, opts).then((mongoose) => {
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
