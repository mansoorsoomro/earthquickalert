import mongoose, { Schema, model, models } from 'mongoose';

const PreparednessGuideSchema = new Schema({
    category: { type: String, required: true, unique: true }, // e.g., 'individual_evacuation'
    title: { type: String, required: true },
    items: [{ type: String, required: true }],
}, {
    timestamps: true,
});

if (process.env.NODE_ENV !== 'production' && models.PreparednessGuide) {
    delete models.PreparednessGuide;
}

const PreparednessGuide = models.PreparednessGuide || model('PreparednessGuide', PreparednessGuideSchema);

export default PreparednessGuide;
