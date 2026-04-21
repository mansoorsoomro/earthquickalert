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
  subAdminName: { type: String },
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

const ActiveEmergencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
  subAdminName: { type: String },
}, { timestamps: true });

const AlertSentEmergencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
  subAdminName: { type: String },
}, { timestamps: true });

const VirtualEOCStatusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
  subAdminName: { type: String },
}, { timestamps: true });

const AlertCommunicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  iconType: { type: String },
  location: { type: String, required: true },
  issuedAt: { type: String },
  expiresAt: { type: String },
  status: { type: String },
  severity: { type: String },
  description: { type: String },
  instructions: [String],
  preparednessTip: { type: String }
}, { timestamps: true });

const Ready2GoUserImpacted = mongoose.models.Ready2GoUserImpacted || mongoose.model('Ready2GoUserImpacted', Ready2GoUserImpactedSchema);
const Responder = mongoose.models.Responder || mongoose.model('Responder', ResponderSchema);
const ActiveEmergency = mongoose.models.ActiveEmergency || mongoose.model('ActiveEmergency', ActiveEmergencySchema);
const AlertSentEmergency = mongoose.models.AlertSentEmergency || mongoose.model('AlertSentEmergency', AlertSentEmergencySchema);
const VirtualEOCStatus = mongoose.models.VirtualEOCStatus || mongoose.model('VirtualEOCStatus', VirtualEOCStatusSchema);
const AlertCommunication = mongoose.models.AlertCommunication || mongoose.model('AlertCommunication', AlertCommunicationSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  lat: { type: Number },
  lng: { type: Number },
  accountStatus: { type: String, default: 'approved' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Clear existing data
    console.log('Clearing old collections...');
    await Ready2GoUserImpacted.deleteMany({});
    await Responder.deleteMany({});
    await ActiveEmergency.deleteMany({});
    await AlertSentEmergency.deleteMany({});
    await VirtualEOCStatus.deleteMany({});
    await AlertCommunication.deleteMany({});
    await User.deleteMany({});

    // Seed Sub-Admins
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const mockAdmins = [
      { name: "Mansoor Soomro", email: "mansoor@example.com", password: hashedPassword, role: "sub-admin", lat: 29.7604, lng: -95.3698 }, // Houston, TX
      { name: "Atiya Mansoor", email: "atiya@example.com", password: hashedPassword, role: "sub-admin", lat: 34.0522, lng: -118.2437 }, // LA, CA
      { name: "John Smith", email: "john@example.com", password: hashedPassword, role: "sub-admin", lat: 41.8781, lng: -87.6298 },   // Chicago, IL
      { name: "Jane Doe", email: "jane@example.com", password: hashedPassword, role: "sub-admin", lat: 40.7128, lng: -74.0060 }       // NYC, NY
    ];

    console.log(`Seeding ${mockAdmins.length} Sub-Admin users...`);
    await User.insertMany(mockAdmins);

    // Seed Citizens (Distributed by State)
    const mockUsers = [
      // Texas (TX) -> Mansoor Soomro
      { name: "Maria Hernandez", location: "Downtown Houston, TX", city: "Houston", time: new Date().toLocaleTimeString(), status: "At Risk", subAdminName: "Mansoor Soomro", lat: 29.7604, lng: -95.3698 },
      { name: "Elena Gomez", location: "Eastside, Austin, TX", city: "Austin", time: new Date().toLocaleTimeString(), status: "At Risk", subAdminName: "Mansoor Soomro", lat: 30.2672, lng: -97.7431 },
      
      // California (CA) -> Atiya Mansoor
      { name: "Sarah Chen", location: "Santa Monica, CA", city: "Santa Monica", time: new Date().toLocaleTimeString(), status: "Safe", subAdminName: "Atiya Mansoor", lat: 34.0195, lng: -118.4912 },
      { name: "Li Wang", location: "Chinatown, San Francisco, CA", city: "San Francisco", time: new Date().toLocaleTimeString(), status: "Safe", subAdminName: "Atiya Mansoor", lat: 37.7749, lng: -122.4194 },
      
      // Illinois (IL) -> John Smith
      { name: "Robert Taylor", location: "Loop District, Chicago, IL", city: "Chicago", time: new Date().toLocaleTimeString(), status: "At Risk", subAdminName: "John Smith", lat: 41.8781, lng: -87.6298 },
      
      // New York (NY) -> Jane Doe
      { name: "James Wilson", location: "Lower Manhattan, NY", city: "New York", time: new Date().toLocaleTimeString(), status: "At Risk", subAdminName: "Jane Doe", lat: 40.7128, lng: -74.0060 }
    ];

    console.log(`Seeding ${mockUsers.length} Citizens across 4 admins...`);
    await Ready2GoUserImpacted.insertMany(mockUsers);

    // Seed Responders
    const mockResponders = [
      { name: "Squad 42 - Fire & Rescue", type: "Fire", status: "Active", location: "Downtown Station", city: "Los Angeles", availability: true, contact: "+1-555-0101", coordinates: { lat: 34.0522, lng: -118.2437 } },
      { name: "Metro Police Unit 12", type: "Police", status: "Active", location: "North sector", city: "New York", availability: true, contact: "+1-555-0102", coordinates: { lat: 40.7128, lng: -74.0060 } }
    ];

    console.log(`Seeding ${mockResponders.length} Responders...`);
    await Responder.insertMany(mockResponders);

    // Seed Active Emergencies (Across 4 admins)
    const mockActive = [
      { name: "Flash Flood Warning", location: "Central Houston", city: "Houston", time: "10:00 AM", status: "Critical", subAdminName: "Mansoor Soomro" },
      { name: "Wildfire Alert", location: "Bel Air", city: "Los Angeles", time: "11:00 AM", status: "Active", subAdminName: "Atiya Mansoor" },
      { name: "Winter Storm", location: "North Side", city: "Chicago", time: "09:00 AM", status: "Watch", subAdminName: "John Smith" },
      { name: "Subway Flooding", location: "Brooklyn", city: "New York", time: "08:30 AM", status: "Active", subAdminName: "Jane Doe" }
    ];
    console.log(`Seeding ${mockActive.length} Active Emergencies...`);
    await ActiveEmergency.insertMany(mockActive);

    // Seed Alerts Sent
    const mockAlerts = [
      { name: "Flood Alert", location: "Harris County", city: "Houston", time: "09:00 AM", status: "Sent", subAdminName: "Mansoor Soomro" },
      { name: "Heat Wave Warning", location: "San Fernando Valley", city: "Los Angeles", time: "07:00 AM", status: "Sent", subAdminName: "Atiya Mansoor" },
      { name: "Tornado Warning", location: "Cook County", city: "Chicago", time: "12:00 PM", status: "Sent", subAdminName: "John Smith" },
      { name: "Blizzard Warning", location: "Albany", city: "New York", time: "06:00 PM", status: "Sent", subAdminName: "Jane Doe" }
    ];
    console.log(`Seeding ${mockAlerts.length} Alerts...`);
    await AlertSentEmergency.insertMany(mockAlerts);

    // Seed Virtual EOC Status
    const mockEOC = [
      { name: "Houston EOC", location: "TX-Center", city: "Houston", time: "Now", status: "Operational", subAdminName: "Mansoor Soomro" },
      { name: "LA Operations Center", location: "CA-West", city: "Los Angeles", time: "Now", status: "Active", subAdminName: "Atiya Mansoor" },
      { name: "Chicago Response Hub", location: "IL-Central", city: "Chicago", time: "Now", status: "Standby", subAdminName: "John Smith" },
      { name: "NYC Command Post", location: "NY-Metro", city: "New York", time: "Now", status: "Operational", subAdminName: "Jane Doe" }
    ];
    console.log(`Seeding ${mockEOC.length} EOC Statuses...`);
    await VirtualEOCStatus.insertMany(mockEOC);

    // Seed Alert Communication
    const mockAlertComms = [
      {
        name: "Tornado Warning",
        type: "Warning",
        iconType: "lightning",
        location: "Cook County, DuPage County",
        issuedAt: "12 min ago",
        expiresAt: "3:45 PM",
        status: "Take Action",
        severity: "Extreme",
        description: "A tornado has been sighted or indicated by weather radar. Imminent danger to life and property.",
        instructions: ["Seek shelter in basement", "Avoid windows", "Protect head/neck"],
        preparednessTip: "Charge your devices and stay in your safe room."
      },
      {
        name: "Flash Flood Warning",
        type: "Warning",
        iconType: "cloud",
        location: "Harris County",
        issuedAt: "5 min ago",
        expiresAt: "6:00 PM",
        status: "Take Action",
        severity: "Severe",
        description: "Heavy rainfall causing flash flooding. Turn around, don't drown.",
        instructions: ["Move to higher ground", "Avoid flooded roads", "Stay away from creeks"],
        preparednessTip: "Do not attempt to walk or drive through flood waters."
      },
      {
        name: "Winter Storm Warning",
        type: "Warning",
        iconType: "cloud",
        location: "Will County, Chicago",
        issuedAt: "1 hour ago",
        expiresAt: "10:00 PM",
        status: "Get Prepared",
        severity: "High",
        description: "Heavy snow and blowing snow expected. Travel will be very difficult.",
        instructions: ["Avoid travel if possible", "Keep an emergency kit in your car", "Check on neighbors"],
        preparednessTip: "Ensure you have adequate food and warm blankets."
      },
      {
        name: "Special Marine Warning",
        type: "Warning",
        iconType: "lightning",
        location: "Lake Michigan Nearshore",
        issuedAt: "22 min ago",
        expiresAt: "4:30 PM",
        status: "Take Action",
        severity: "High",
        description: "Strong winds and large waves detected near shore. Boaters should seek safe harbor.",
        instructions: ["Move to safe harbor", "Ensure life jackets are on", "Secure loose gear"],
        preparednessTip: "Monitor marine radio channel 16."
      },
      {
        name: "High Wind Warning",
        type: "Warning",
        iconType: "lightning",
        location: "Miami-Dade County",
        issuedAt: "15 min ago",
        expiresAt: "5:00 PM",
        status: "Take Action",
        severity: "High",
        description: "Damaging winds could blow down trees and power lines.",
        instructions: ["Avoid being outside near trees", "Secure outdoor furniture", "Stay in lower levels"],
        preparednessTip: "Expect power outages in affected sectors."
      },
      {
        name: "Flood Advisory",
        type: "Advisory",
        iconType: "cloud",
        location: "Los Angeles Basin",
        issuedAt: "30 min ago",
        expiresAt: "7:00 PM",
        status: "Get Prepared",
        severity: "Moderate",
        description: "Minor flooding in low-lying areas and poor drainage sectors.",
        instructions: ["Be aware of rising water", "Avoid low-lying roads", "Report drainage issues"],
        preparednessTip: "Keep gutters and storm drains clear of debris."
      },
      {
        name: "Air Quality Alert",
        type: "Advisory",
        iconType: "cloud",
        location: "Manhattan, NY",
        issuedAt: "2 hours ago",
        expiresAt: "Tomorrow 8:00 AM",
        status: "Get Prepared",
        severity: "Moderate",
        description: "Elevated ozone levels detected. Sensitive groups should limit outdoor time.",
        instructions: ["Limit outdoor exercise", "Keep windows closed", "Use air purifiers"],
        preparednessTip: "Check AirNow.gov for real-time AQI updates."
      }
    ];
    console.log(`Seeding ${mockAlertComms.length} Alert Communications...`);
    await AlertCommunication.insertMany(mockAlertComms);

    console.log('\x1b[32m%s\x1b[0m', 'Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seed();
