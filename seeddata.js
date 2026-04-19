const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Basic env loader for a standalone script
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1]] = match[2].trim();
      }
    });
  }
}

loadEnv();

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Ensure we connect to the 'ready2go' database
if (MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    const url = new URL(MONGODB_URI);
    if (!url.pathname || url.pathname === '/') {
      url.pathname = '/ready2go';
      MONGODB_URI = url.toString();
    }
  } catch (e) {
    console.error('Error parsing MONGODB_URI:', e);
  }
}

// Model Schemas
const Ready2GoUserImpactedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
}, { timestamps: true });

const ResponderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  availability: { type: Boolean, default: true },
  contact: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

const Ready2GoUserImpacted = mongoose.models.Ready2GoUserImpacted || mongoose.model('Ready2GoUserImpacted', Ready2GoUserImpactedSchema);
const Responder = mongoose.models.Responder || mongoose.model('Responder', ResponderSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Clear existing data
    console.log('Clearing old collections...');
    await Ready2GoUserImpacted.deleteMany({});
    await Responder.deleteMany({});

    // Seed Citizens
    const mockUsers = [
      {
        name: "Maria Hernandez",
        location: "Downtown Houston, TX",
        city: "Houston",
        time: new Date().toLocaleTimeString(),
        status: "At Risk",
        lat: 29.7604,
        lng: -95.3698
      },
      {
        name: "James Wilson",
        location: "Lower Manhattan, NY",
        city: "New York",
        time: new Date().toLocaleTimeString(),
        status: "At Risk",
        lat: 40.7128,
        lng: -74.0060
      },
      {
        name: "Sarah Chen",
        location: "Santa Monica, CA",
        city: "Santa Monica",
        time: new Date().toLocaleTimeString(),
        status: "At Risk",
        lat: 34.0195,
        lng: -118.4912
      },
      {
        name: "Robert Taylor",
        location: "Loop District, Chicago, IL",
        city: "Chicago",
        time: new Date().toLocaleTimeString(),
        status: "At Risk",
        lat: 41.8781,
        lng: -87.6298
      }
    ];

    console.log(`Seeding ${mockUsers.length} Citizens...`);
    await Ready2GoUserImpacted.insertMany(mockUsers);

    // Seed Responders
    const mockResponders = [
      {
        name: "Squad 42 - Fire & Rescue",
        type: "Fire",
        status: "Active",
        location: "Downtown Station",
        city: "Los Angeles",
        availability: true,
        contact: "+1-555-0101",
        coordinates: { lat: 34.0522, lng: -118.2437 }
      },
      {
        name: "Metro Police Unit 12",
        type: "Police",
        status: "Active",
        location: "North sector",
        city: "New York",
        availability: true,
        contact: "+1-555-0102",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      {
        name: "EMS Critical Care Team 5",
        type: "EMS",
        status: "Standby",
        location: "Central Hospital",
        city: "Chicago",
        availability: true,
        contact: "+1-555-0103",
        coordinates: { lat: 41.8781, lng: -87.6298 }
      },
      {
        name: "Hazmat Response Team Alpha",
        type: "Hazmat",
        status: "Active",
        location: "Industrial Zone",
        city: "Houston",
        availability: false,
        contact: "+1-555-0104",
        coordinates: { lat: 29.7604, lng: -95.3698 }
      }
    ];

    console.log(`Seeding ${mockResponders.length} Responders...`);
    await Responder.insertMany(mockResponders);

    console.log('\x1b[32m%s\x1b[0m', 'Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seed();
