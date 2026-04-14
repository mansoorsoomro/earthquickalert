import mongoose, { Schema, model, models } from 'mongoose';

const Ready2GoUserImpactedSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true },
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.Ready2GoUserImpacted) {
    delete models.Ready2GoUserImpacted;
}

const Ready2GoUserImpacted = models.Ready2GoUserImpacted || model('Ready2GoUserImpacted', Ready2GoUserImpactedSchema);

export default Ready2GoUserImpacted;
