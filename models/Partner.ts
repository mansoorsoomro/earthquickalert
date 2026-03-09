import mongoose, { Schema, model, models } from 'mongoose';

const PartnerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['nonprofit', 'business'],
        required: true,
    },
    // Nonprofit fields
    function: {
        type: String,
        default: '',
    },
    contact: {
        type: String,
        default: 'Unassigned',
    },
    // Business fields
    sector: {
        type: String,
        default: '',
    },
    support: {
        type: String,
        default: '',
    },
    // Shared fields
    area: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Active', 'Standby', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.Partner) {
    delete models.Partner;
}

const Partner = models.Partner || model('Partner', PartnerSchema);

export default Partner;
