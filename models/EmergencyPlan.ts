import mongoose, { Schema, model, models } from 'mongoose';

const EmergencyPlanSchema = new Schema({
    planId: { type: String, required: true, unique: true }, // e.g., 'hurricane_warning'
    label: { type: String, required: true },
    overview: { type: String, required: true },
    steps: [{ type: String }],
    attachments: [{
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        size: { type: Number },
        uploadedAt: { type: Date, default: Date.now },
    }],
}, {
    timestamps: true,
});

if (process.env.NODE_ENV !== 'production' && models.EmergencyPlan) {
    delete models.EmergencyPlan;
}

const EmergencyPlan = models.EmergencyPlan || model('EmergencyPlan', EmergencyPlanSchema);

export default EmergencyPlan;
