import mongoose, { Schema, model, models } from 'mongoose';

const SystemStatusSchema = new Schema({
    emergencyMode: {
        type: String,
        enum: ['safe', 'danger'],
        default: 'safe',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const SystemStatus = models.SystemStatus || model('SystemStatus', SystemStatusSchema);

export default SystemStatus;
