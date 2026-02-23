import mongoose, { Schema, model, models } from 'mongoose';

export interface IIncidentReport {
    type: string;
    location: string;
    lat?: number;
    lng?: number;
    description: string;
    reportedBy: string;
    source: 'AI Feed' | 'End User';
    status: 'Submitted' | 'Active' | 'Crew Dispatched' | 'Crew En Route' | 'Resolved';
    createdAt: Date;
    updatedAt: Date;
}

const IncidentReportSchema = new Schema<IIncidentReport>({
    type: {
        type: String,
        required: true,
        enum: ['Road Closure', 'Downed Tree', 'Water Main Leak', 'Power Outage', 'Other'],
    },
    location: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    description: {
        type: String,
        default: '',
    },
    reportedBy: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        enum: ['AI Feed', 'End User'],
        default: 'End User',
    },
    status: {
        type: String,
        enum: ['Submitted', 'Active', 'Crew Dispatched', 'Crew En Route', 'Resolved'],
        default: 'Submitted',
    }
}, {
    timestamps: true,
});

// Clear Mongoose models in development to apply schema changes
if (process.env.NODE_ENV !== 'production' && models.IncidentReport) {
    delete models.IncidentReport;
}

const IncidentReport = models.IncidentReport || model('IncidentReport', IncidentReportSchema);

export default IncidentReport;
