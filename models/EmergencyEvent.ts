import mongoose, { Schema, model, models } from 'mongoose';

const EventTimelineItemSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: String, required: true },
});

const EmergencyEventSchema = new Schema({
    type: {
        type: String,
        enum: ['earthquake', 'hurricane', 'tornado', 'flood', 'wildfire', 'severe-weather', 'other'],
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'monitoring', 'resolved', 'archived'],
        default: 'active',
    },
    severity: {
        type: String,
        enum: ['critical', 'warning', 'watch', 'advisory', 'extreme', 'severe', 'moderate', 'minor'],
        required: true,
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true },
    },
    affectedZones: [{ type: String }],
    magnitude: { type: Number },
    category: { type: Number },
    windSpeed: { type: Number },
    createdBy: { type: String, required: true },
    timeline: [EventTimelineItemSchema],
    resolvedAt: { type: Date },
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.EmergencyEvent) {
    delete models.EmergencyEvent;
}

const EmergencyEvent = models.EmergencyEvent || model('EmergencyEvent', EmergencyEventSchema);

export default EmergencyEvent;
