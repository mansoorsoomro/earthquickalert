import mongoose, { Schema, model, models } from 'mongoose';

const WeatherAlertTypeConfigSchema = new Schema({
    events: [
        {
            name: { type: String, required: true },
            enabled: { type: Boolean, default: true },
            sendPush: { type: Boolean, default: false },
            sendSms: { type: Boolean, default: false },
            sendEmail: { type: Boolean, default: false },
            invalid: { type: Boolean, default: false },
            lastSeenAt: { type: Date },
        },
    ],
}, {
    timestamps: true,
});

if (process.env.NODE_ENV !== 'production' && (models as any).WeatherAlertTypeConfig) {
    delete (models as any).WeatherAlertTypeConfig;
}

const WeatherAlertTypeConfig = models.WeatherAlertTypeConfig || model('WeatherAlertTypeConfig', WeatherAlertTypeConfigSchema);

export default WeatherAlertTypeConfig;
