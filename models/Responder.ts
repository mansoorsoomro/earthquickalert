import mongoose, { Schema, model, models } from 'mongoose';

const ResponderSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Police, Fire, EMS, Search & Rescue
    status: { type: String, required: true }, // e.g., Active, Standby, Off-duty
    location: { type: String, required: true },
    city: { type: String, required: true },
    availability: { type: Boolean, default: true },
    contact: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.Responder) {
    delete models.Responder;
}

const Responder = models.Responder || model('Responder', ResponderSchema);

export default Responder;
