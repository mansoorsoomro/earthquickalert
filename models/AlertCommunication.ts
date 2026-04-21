import mongoose, { Schema, model, models } from 'mongoose';

const AlertCommunicationSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // Watch or Warning
    iconType: { type: String, required: true }, // triangle, lightning, cloud
    location: { type: String, required: true },
    issuedAt: { type: String, required: true }, // e.g., "12 min ago"
    expiresAt: { type: String, required: true }, // e.g., "3:45 PM"
    status: { type: String, required: true }, // "Take Action" or "Get Prepared"
    description: { type: String },
    instructions: [{ type: String }],
    preparednessTip: { type: String },
    severity: { type: String, default: 'Moderate' },
}, {
    timestamps: true,
});

if (process.env.NODE_ENV !== 'production' && models.AlertCommunication) {
    delete models.AlertCommunication;
}

const AlertCommunication = models.AlertCommunication || model('AlertCommunication', AlertCommunicationSchema);

export default AlertCommunication;
