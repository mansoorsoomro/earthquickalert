import mongoose, { Schema, model, models } from 'mongoose';

const EOCSettingsSchema = new Schema({
    licenseId: {
        type: Schema.Types.ObjectId,
        ref: 'License',
        required: [true, 'EOC Settings must belong to a license'],
        unique: true, // 1:1 relationship with License
    },
    activationThresholds: {
        minor: { triggerEOC: { type: Boolean, default: false } },
        moderate: { triggerEOC: { type: Boolean, default: false } },
        major: { triggerEOC: { type: Boolean, default: true } },
        catastrophic: { triggerEOC: { type: Boolean, default: true } },
    },
    pollingIntervals: {
        eventTypesForOneMinute: [{ 
            type: String, 
            enum: ['earthquake', 'hurricane', 'tornado', 'flood', 'wildfire', 'severe-weather', 'other'] 
        }],
    },
    communicationTemplates: [{
        severity: String,
        messageBody: String, 
    }],
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
