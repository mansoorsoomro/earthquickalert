import mongoose, { Schema, model, models } from 'mongoose';

export interface IFieldReport {
    name: string;
    category: string;
    incidentDate: Date;
    fileReference: string;
    status: 'Review' | 'Reviewed';
    createdAt: Date;
    updatedAt: Date;
}

const FieldReportSchema = new Schema<IFieldReport>({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Road Closures', 'Structural Damage', 'Medical Emergency', 'Fire/Hazmat', 'Other'],
    },
    incidentDate: {
        type: Date,
        required: true,
    },
    fileReference: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Review', 'Reviewed'],
        default: 'Review',
    }
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.FieldReport) {
    delete models.FieldReport;
}

const FieldReport = models.FieldReport || model('FieldReport', FieldReportSchema);

export default FieldReport;
