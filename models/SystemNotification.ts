import mongoose, { Schema, model, models } from 'mongoose';

const SystemNotificationSchema = new Schema({
    type: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    meta: { type: Schema.Types.Mixed },
}, {
    timestamps: true,
});

SystemNotificationSchema.index(
    { type: 1, 'meta.userId': 1, 'meta.alertId': 1, 'meta.channel': 1 },
    { sparse: true }
);

if (process.env.NODE_ENV !== 'production' && (models as any).SystemNotification) {
    delete (models as any).SystemNotification;
}

const SystemNotification = models.SystemNotification || model('SystemNotification', SystemNotificationSchema);

export default SystemNotification;
