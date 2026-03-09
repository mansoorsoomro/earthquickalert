import SystemNotification from '@/models/SystemNotification';

export type NotificationChannel = 'push' | 'sms' | 'email';
export interface WeatherDispatchInput {
    userId: string;
    alertId: string;
    title: string;
    message: string;
    channels: NotificationChannel[];
    providerUrl?: string;
    event?: string;
    severity?: string;
    expiresAt?: string;
    affectedAreas?: string[];
}

export class NotificationService {
    /**
     * Log a system-level notification intended for administrators.
     * In this implementation we only persist to MongoDB; real email/SMS
     * providers can be added later.
     */
    async sendAdminSystemEmail(subject: string, message: string, meta?: Record<string, any>) {
        try {
            await SystemNotification.create({
                type: 'system_email',
                subject,
                message,
                meta: meta || {},
            });
        } catch (error) {
            console.error('Failed to persist system notification:', error);
        }
    }

    /**
     * Log a user-directed notification (push/SMS/email) so it can be tracked and audited.
     */
    async sendUserNotification(
        userId: string,
        subject: string,
        message: string,
        channels: NotificationChannel[] = [],
        meta?: Record<string, any>
    ) {
        try {
            await SystemNotification.create({
                type: 'user_notification',
                subject,
                message,
                meta: {
                    userId,
                    channels,
                    ...meta,
                },
            });
        } catch (error) {
            console.error('Failed to persist user notification:', error);
        }
    }

    private async hasDeliveryRecord(
        userId: string,
        alertId: string,
        channel: NotificationChannel
    ): Promise<boolean> {
        const existing = await SystemNotification.findOne({
            type: 'user_notification',
            'meta.userId': userId,
            'meta.alertId': alertId,
            'meta.channel': channel,
        }).select('_id').lean();

        return Boolean(existing);
    }

    async dispatchWeatherAlertNotification(input: WeatherDispatchInput): Promise<NotificationChannel[]> {
        const deliveredChannels: NotificationChannel[] = [];
        const providerUrl = input.providerUrl || 'https://api.weather.gov/alerts/active';

        for (const channel of input.channels) {
            try {
                const alreadyDelivered = await this.hasDeliveryRecord(input.userId, input.alertId, channel);
                if (alreadyDelivered) continue;

                const channelPrefix =
                    channel === 'push' ? '[Push]' :
                        channel === 'sms' ? '[SMS]' :
                            '[Email]';

                const messageWithProviderLink = channel === 'push'
                    ? `${input.message}\n\nProvider: ${providerUrl}`
                    : input.message;

                await SystemNotification.create({
                    type: 'user_notification',
                    subject: `${channelPrefix} ${input.title}`,
                    message: messageWithProviderLink,
                    meta: {
                        userId: input.userId,
                        alertId: input.alertId,
                        channel,
                        event: input.event,
                        severity: input.severity,
                        expiresAt: input.expiresAt,
                        affectedAreas: input.affectedAreas || [],
                        providerUrl,
                    },
                });

                deliveredChannels.push(channel);
            } catch (error) {
                console.error(`Failed to persist ${channel} weather notification:`, error);
            }
        }

        return deliveredChannels;
    }
}

export const notificationService = new NotificationService();
