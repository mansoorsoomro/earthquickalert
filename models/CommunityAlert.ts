import mongoose, { Schema, model, models } from 'mongoose';

const CommunityAlertSchema = new Schema({
    source: {
        type: String,
        default: 'admin_manual',
    },
    severity: {
        type: String,
        enum: ['critical', 'extreme', 'severe', 'warning', 'watch', 'advisory', 'moderate', 'minor', 'info', 'low', 'high'],
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    affectedAreas: [{ type: String }],
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    targetUsers: [{ type: String }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.CommunityAlert) {
    delete models.CommunityAlert;
}

const CommunityAlert = models.CommunityAlert || model('CommunityAlert', CommunityAlertSchema);

export default CommunityAlert;
