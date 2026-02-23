// Custom React hook for managing API alerts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertFilters, AlertSource, AlertSeverity } from '@/lib/types/api-alerts';
import { alertProcessor } from '@/lib/services/alert-processor';

interface UseAPIAlertsOptions {
    location?: { lat: number; lon: number };
    autoRefresh?: boolean;
    refreshInterval?: number; // in milliseconds
    filters?: AlertFilters;
}

interface UseAPIAlertsReturn {
    alerts: Alert[];
    loading: boolean;
    error: Error | null;
    unreadCount: number;
    statistics: ReturnType<typeof alertProcessor.getStatistics>;
    refresh: () => Promise<void>;
    markAsRead: (alertId: string) => void;
    markAllAsRead: () => void;
    filterAlerts: (filters: AlertFilters) => Alert[];
}

export function useAPIAlerts(options: UseAPIAlertsOptions = {}): UseAPIAlertsReturn {
    const {
        location,
        autoRefresh = true,
        refreshInterval = 30000, // 30 seconds default
        filters,
    } = options;

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const fetchedAlerts = await alertProcessor.fetchAllAlerts(location, filters?.source);

            // Apply filters if provided
            const filtered = filters
                ? alertProcessor.filterAlerts(filters)
                : fetchedAlerts;

            setAlerts(filtered);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    }, [location?.lat, location?.lon, filters]);

    // Initial fetch
    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchAlerts();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchAlerts]);

    // Subscribe to alert updates
    useEffect(() => {
        const unsubscribe = alertProcessor.subscribe((updatedAlerts) => {
            const filtered = filters
                ? alertProcessor.filterAlerts(filters)
                : updatedAlerts;

            setAlerts(filtered);
        });

        return unsubscribe;
    }, [filters]);

    const markAsRead = useCallback((alertId: string) => {
        alertProcessor.markAsRead(alertId);
    }, []);

    const markAllAsRead = useCallback(() => {
        alertProcessor.markAllAsRead();
    }, []);

    const filterAlertsCallback = useCallback((newFilters: AlertFilters) => {
        return alertProcessor.filterAlerts(newFilters);
    }, []);

    return {
        alerts,
        loading,
        error,
        unreadCount: alertProcessor.getUnreadCount(),
        statistics: alertProcessor.getStatistics(),
        refresh: fetchAlerts,
        markAsRead,
        markAllAsRead,
        filterAlerts: filterAlertsCallback,
    };
}

// Hook for earthquake data specifically
export function useEarthquakeData(location?: { lat: number; lon: number }) {
    return useAPIAlerts({
        location,
        filters: {
            source: [AlertSource.EARTHQUAKE_API],
        },
    });
}

// Hook for weather data specifically
export function useWeatherData(location?: { lat: number; lon: number }) {
    return useAPIAlerts({
        location,
        filters: {
            source: [AlertSource.WEATHER_API],
        },
    });
}

// Hook for admin notifications specifically
export function useAdminNotifications() {
    return useAPIAlerts({
        filters: {
            source: [AlertSource.ADMIN_MANUAL],
        },
    });
}
