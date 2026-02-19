// Alert Card Component - Display individual alerts with source badges

'use client';

import { Alert, AlertSource, AlertSeverity } from '@/lib/types/api-alerts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CloudRain,
    Activity,
    Bell,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
    alert: Alert;
    onMarkAsRead?: (alertId: string) => void;
    onClick?: (alert: Alert) => void;
}

export function AlertCard({ alert, onMarkAsRead, onClick }: AlertCardProps) {
    const getSourceIcon = () => {
        switch (alert.source) {
            case AlertSource.WEATHER_API:
                return <CloudRain className="h-4 w-4" />;
            case AlertSource.EARTHQUAKE_API:
                return <Activity className="h-4 w-4" />;
            case AlertSource.ADMIN_MANUAL:
                return <Bell className="h-4 w-4" />;
        }
    };

    const getSourceLabel = () => {
        switch (alert.source) {
            case AlertSource.WEATHER_API:
                return 'Weather API';
            case AlertSource.EARTHQUAKE_API:
                return 'Earthquake API';
            case AlertSource.ADMIN_MANUAL:
                return 'Admin Notification';
        }
    };

    const getSourceColor = () => {
        switch (alert.source) {
            case AlertSource.WEATHER_API:
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case AlertSource.EARTHQUAKE_API:
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case AlertSource.ADMIN_MANUAL:
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        }
    };

    const getSeverityColor = () => {
        switch (alert.severity) {
            case AlertSeverity.EXTREME:
                return 'bg-red-500 text-white';
            case AlertSeverity.SEVERE:
                return 'bg-orange-500 text-white';
            case AlertSeverity.HIGH:
                return 'bg-yellow-500 text-black';
            case AlertSeverity.MODERATE:
                return 'bg-blue-500 text-white';
            case AlertSeverity.LOW:
                return 'bg-green-500 text-white';
            case AlertSeverity.INFO:
                return 'bg-gray-500 text-white';
        }
    };

    const getSeverityLabel = () => {
        return alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1);
    };

    return (
        <Card
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${alert.isRead ? 'opacity-60' : ''
                }`}
            onClick={() => onClick?.(alert)}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                    {/* Header with source and severity */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={getSourceColor()}>
                            <span className="flex items-center gap-1">
                                {getSourceIcon()}
                                <span className="text-xs">{getSourceLabel()}</span>
                            </span>
                        </Badge>

                        <Badge className={getSeverityColor()}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {getSeverityLabel()}
                        </Badge>

                        {alert.isRead && (
                            <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Read
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg leading-tight">{alert.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {alert.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                        </span>

                        {alert.affectedAreas && alert.affectedAreas.length > 0 && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alert.affectedAreas[0]}
                            </span>
                        )}

                        {/* Earthquake specific */}
                        {alert.source === AlertSource.EARTHQUAKE_API && 'magnitude' in alert && (
                            <span className="font-medium">
                                Magnitude: {alert.magnitude.toFixed(1)}
                            </span>
                        )}

                        {/* Weather specific */}
                        {alert.source === AlertSource.WEATHER_API && 'weatherType' in alert && (
                            <span className="capitalize">{alert.weatherType}</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {!alert.isRead && onMarkAsRead && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(alert.id);
                        }}
                    >
                        Mark as Read
                    </Button>
                )}
            </div>
        </Card>
    );
}
