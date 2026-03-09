import mongoose, { Schema, model, models } from 'mongoose';

const WeatherAlertTypeChangeLogSchema = new Schema({
    newEvents: [{ type: String }],
    removedEvents: [{ type: String }],
    invalidEnabledEvents: [{ type: String }],
    detectedEvents: [{ type: String }],
    automationPaused: { type: Boolean, default: false },
    processed: { type: Boolean, default: false },
}, {
    timestamps: true,
});

if (process.env.NODE_ENV !== 'production' && (models as any).WeatherAlertTypeChangeLog) {
    delete (models as any).WeatherAlertTypeChangeLog;
}

const WeatherAlertTypeChangeLog = models.WeatherAlertTypeChangeLog || model('WeatherAlertTypeChangeLog', WeatherAlertTypeChangeLogSchema);

export default WeatherAlertTypeChangeLog;
