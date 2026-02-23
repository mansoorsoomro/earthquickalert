// Alert Processor - Central alert processing and distribution logic

import { Alert, AlertSource, AlertSeverity, AlertFilters } from '@/lib/types/api-alerts';
import { earthquakeAPI } from './earthquake-api';
import { weatherAPI } from './weather-api';

export class AlertProcessor {
    private alerts: Alert[] = [];
    private listeners: Array<(alerts: Alert[]) => void> = [];

    /**
     * Fetch all alerts from all sources
     */
    async fetchAllAlerts(
        location?: { lat: number; lon: number },
        sources?: AlertSource[]
    ): Promise<Alert[]> {
        try {
            const allAlerts: Alert[] = [];
            const fetchAll = !sources || sources.length === 0;

            // Fetch earthquake alerts
            if (fetchAll || sources?.includes(AlertSource.EARTHQUAKE_API)) {
                try {
                    if (location) {
                        const earthquakeAlerts = await earthquakeAPI.fetchEarthquakesByLocation(location.lat, location.lon, 500);
                        allAlerts.push(...earthquakeAlerts);
                    } else {
                        const earthquakeAlerts = await earthquakeAPI.fetchEarthquakes('day', 4.0);
                        allAlerts.push(...earthquakeAlerts);
                    }
                } catch (error) {
                    console.error('Error fetching earthquake alerts:', error);
                }
            }

            // Fetch weather alerts
            if (location && (fetchAll || sources?.includes(AlertSource.WEATHER_API))) {
                try {
                    const weatherAlerts = await weatherAPI.fetchWeatherAlerts(location.lat, location.lon);
                    allAlerts.push(...weatherAlerts);
                } catch (error) {
                    console.error('Error fetching weather alerts:', error);
                }
            }

            // Fetch community alerts from DB
            if (fetchAll || sources?.includes(AlertSource.ADMIN_MANUAL)) {
                try {
                    const res = await fetch('/api/alerts/community');
                    if (res.ok) {
                        const communityData = await res.json();
                        if (communityData.success) {
                            const dbAlerts = communityData.data.map((alert: any) => ({
                                id: alert._id || alert.id,
                                source: AlertSource.ADMIN_MANUAL,
                                severity: alert.severity as AlertSeverity,
                                title: alert.title,
                                description: alert.description,
                                timestamp: alert.timestamp || alert.createdAt,
                                expiresAt: alert.expiresAt,
                                affectedAreas: alert.affectedAreas,
                                adminName: alert.adminName,
                                priority: alert.priority,
                                isRead: false,
                            }));
                            allAlerts.push(...dbAlerts);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching community alerts:', error);
                }
            }

            // Sort by timestamp (newest first)
            allAlerts.sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            this.alerts = allAlerts;
            this.notifyListeners();

            return allAlerts;
        } catch (error) {
            console.error('Error fetching all alerts:', error);
            throw error;
        }
    }

    /**
     * Filter alerts based on criteria
     */
    filterAlerts(filters: AlertFilters): Alert[] {
        let filtered = [...this.alerts];

        if (filters.source && filters.source.length > 0) {
            filtered = filtered.filter(alert => filters.source!.includes(alert.source));
        }

        if (filters.severity && filters.severity.length > 0) {
            filtered = filtered.filter(alert => filters.severity!.includes(alert.severity));
        }

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(alert => new Date(alert.timestamp) >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            filtered = filtered.filter(alert => new Date(alert.timestamp) <= toDate);
        }

        if (filters.isRead !== undefined) {
            filtered = filtered.filter(alert => alert.isRead === filters.isRead);
        }

        if (filters.affectedArea) {
            filtered = filtered.filter(alert =>
                alert.affectedAreas?.some(area =>
                    area.toLowerCase().includes(filters.affectedArea!.toLowerCase())
                )
            );
        }

        return filtered;
    }

    /**
     * Get alerts by severity
     */
    getAlertsBySeverity(severity: AlertSeverity): Alert[] {
        return this.alerts.filter(alert => alert.severity === severity);
    }

    /**
     * Get alerts by source
     */
    getAlertsBySource(source: AlertSource): Alert[] {
        return this.alerts.filter(alert => alert.source === source);
    }

    /**
     * Get active alerts (not expired)
     */
    getActiveAlerts(): Alert[] {
        const now = new Date();
        return this.alerts.filter(alert => {
            if (!alert.expiresAt) return true;
            return new Date(alert.expiresAt) > now;
        });
    }

    /**
     * Mark alert as read
     */
    markAsRead(alertId: string): void {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.isRead = true;
            this.saveReadStatus(alertId);
            this.notifyListeners();
        }
    }

    /**
     * Mark all alerts as read
     */
    markAllAsRead(): void {
        this.alerts.forEach(alert => {
            alert.isRead = true;
            this.saveReadStatus(alert.id);
        });
        this.notifyListeners();
    }

    /**
     * Get unread alert count
     */
    getUnreadCount(): number {
        return this.alerts.filter(alert => !alert.isRead).length;
    }

    /**
     * Subscribe to alert updates
     */
    subscribe(listener: (alerts: Alert[]) => void): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners of alert changes
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.alerts]));
    }

    /**
     * Get admin alerts from localStorage
     */
    private getAdminAlerts(): Alert[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem('adminAlerts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading admin alerts:', error);
            return [];
        }
    }

    /**
     * Save read status to localStorage
     */
    private saveReadStatus(alertId: string): void {
        if (typeof window === 'undefined') return;

        try {
            const readAlerts = this.getReadAlerts();
            if (!readAlerts.includes(alertId)) {
                readAlerts.push(alertId);
                localStorage.setItem('readAlerts', JSON.stringify(readAlerts));
            }
        } catch (error) {
            console.error('Error saving read status:', error);
        }
    }

    /**
     * Get read alerts from localStorage
     */
    private getReadAlerts(): string[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem('readAlerts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading read alerts:', error);
            return [];
        }
    }

    /**
     * Get alert statistics
     */
    getStatistics() {
        const total = this.alerts.length;
        const active = this.getActiveAlerts().length;
        const unread = this.getUnreadCount();

        const bySeverity = {
            extreme: this.getAlertsBySeverity(AlertSeverity.EXTREME).length,
            severe: this.getAlertsBySeverity(AlertSeverity.SEVERE).length,
            high: this.getAlertsBySeverity(AlertSeverity.HIGH).length,
            moderate: this.getAlertsBySeverity(AlertSeverity.MODERATE).length,
            low: this.getAlertsBySeverity(AlertSeverity.LOW).length,
            info: this.getAlertsBySeverity(AlertSeverity.INFO).length,
        };

        const bySource = {
            weather: this.getAlertsBySource(AlertSource.WEATHER_API).length,
            earthquake: this.getAlertsBySource(AlertSource.EARTHQUAKE_API).length,
            admin: this.getAlertsBySource(AlertSource.ADMIN_MANUAL).length,
        };

        return {
            total,
            active,
            unread,
            bySeverity,
            bySource,
        };
    }
}

// Export singleton instance
export const alertProcessor = new AlertProcessor();
