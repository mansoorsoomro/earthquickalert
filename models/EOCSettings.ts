import mongoose, { Schema, model, models } from 'mongoose';

// Singleton-style settings model — only one document is stored
const EOCSettingsSchema = new Schema({
    activationType: {
        type: String,
        enum: ['all', 'major', 'custom'],
        default: 'all',
    },
    customSeverities: {
        minor: { type: Boolean, default: false },
        moderate: { type: Boolean, default: false },
        major: { type: Boolean, default: false },
        catastrophic: { type: Boolean, default: false },
    },
    alertFeeds: {
        nws: { type: Boolean, default: true },
        local: { type: Boolean, default: true },
        other: { type: Boolean, default: true },
    },
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.EOCSettings) {
    delete models.EOCSettings;
}

const EOCSettings = models.EOCSettings || model('EOCSettings', EOCSettingsSchema);

export default EOCSettings;
