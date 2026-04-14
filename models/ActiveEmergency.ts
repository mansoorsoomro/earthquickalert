import mongoose, { Schema, model, models } from 'mongoose';

const ActiveEmergencySchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true },
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.ActiveEmergency) {
    delete models.ActiveEmergency;
}

const ActiveEmergency = models.ActiveEmergency || model('ActiveEmergency', ActiveEmergencySchema);

export default ActiveEmergency;
