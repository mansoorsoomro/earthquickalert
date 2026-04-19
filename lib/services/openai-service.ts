import { Alert, AlertSeverity, AlertSource, SocialMediaAlert, ResourceAlert } from '@/lib/types/api-alerts';

export interface EmergencyInsights {
    status: 'All Clear' | 'Warning' | 'Emergency';
    message: string;
    recommendations: string[];
}

export interface DynamicNews {
    title: string;
    category: 'Traffic' | 'Community' | 'Safety' | 'Emergency';
    time: string;
    img: string;
}

export interface PreparednessTip {
    title: string;
    desc: string;
}

export interface ThreatAssessment {
    relevance: 'High' | 'Medium' | 'Low';
    severity: string;
    affectedAreas: string;
    confidence: number;
    summary: string;
}

export interface AfterActionInsight {
    id: string;
    category: string;
    description: string;
    status: 'Pending' | 'Addressed';
}

export interface OperationalSignals {
    socialSignalLevel: 'normal' | 'elevated' | 'critical';
    hospitalCapacityLevel: 'normal' | 'stressed' | 'overloaded';
    recommendVirtualEOC: boolean;
    rationale: string;
}

type ChatMessage = {
    role: 'system' | 'user';
    content: string;
};

export class OpenAIService {
    private apiKey = process.env.OPENAI_API_KEY || '';
    private model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    private canUseOpenAI(): boolean {
        return Boolean(this.apiKey);
    }

    private async callOpenAI<T>(messages: ChatMessage[], fallback: T): Promise<T> {
        if (!this.canUseOpenAI()) return fallback;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    response_format: { type: 'json_object' },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData?.error?.message || `OpenAI request failed: ${response.status}`);
            }

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content) return fallback;

            return JSON.parse(content) as T;
        } catch (error) {
            console.error('OpenAI request failed, using fallback:', error);
            return fallback;
        }
    }

    private countHighRiskAlerts(alerts: Alert[]): number {
        return alerts.filter(alert =>
            [AlertSeverity.SEVERE, AlertSeverity.EXTREME, AlertSeverity.HIGH].includes(alert.severity)
        ).length;
    }

    detectOperationalSignals(input: {
        alerts: Alert[];
        incidentCount: number;
        safeCheckins: number;
        totalUsers: number;
    }): OperationalSignals {
        const highRiskAlerts = this.countHighRiskAlerts(input.alerts);
        const unsafeUsers = Math.max(input.totalUsers - input.safeCheckins, 0);
        const unsafeRatio = input.totalUsers > 0 ? unsafeUsers / input.totalUsers : 0;

        const socialSignalLevel: OperationalSignals['socialSignalLevel'] =
            input.incidentCount > 30 || highRiskAlerts > 20 || unsafeRatio > 0.35
                ? 'critical'
                : input.incidentCount > 10 || highRiskAlerts > 8 || unsafeRatio > 0.15
                    ? 'elevated'
                    : 'normal';

        const hospitalCapacityLevel: OperationalSignals['hospitalCapacityLevel'] =
            highRiskAlerts > 25 || input.incidentCount > 40
                ? 'overloaded'
                : highRiskAlerts > 10 || input.incidentCount > 15
                    ? 'stressed'
                    : 'normal';

        const recommendVirtualEOC =
            socialSignalLevel !== 'normal' ||
            hospitalCapacityLevel !== 'normal' ||
            unsafeRatio > 0.2;

        const rationale = recommendVirtualEOC
            ? 'Escalation indicators detected from incident tempo, alert severity, and community check-ins.'
            : 'No systemic escalation indicators detected; monitoring can remain in standard operations mode.';

        return {
            socialSignalLevel,
            hospitalCapacityLevel,
            recommendVirtualEOC,
            rationale,
        };
    }

    async generateThreatAssessment(location: string, weatherData: any, earthquakeData: any[]): Promise<ThreatAssessment> {
        const weatherCount = Array.isArray(weatherData) ? weatherData.length : 0;
        const quakeCount = Array.isArray(earthquakeData) ? earthquakeData.length : 0;
        const extremeSignals = (Array.isArray(weatherData) ? weatherData : []).filter(
            (item: any) => item.severity === AlertSeverity.EXTREME || item.severity === AlertSeverity.SEVERE
        ).length;

        const fallback: ThreatAssessment = {
            relevance: extremeSignals > 0 || quakeCount > 0 ? 'High' : weatherCount > 0 ? 'Medium' : 'Low',
            severity: extremeSignals > 0 ? 'Immediate Hazard' : weatherCount > 0 || quakeCount > 0 ? 'Monitoring Required' : 'Stable',
            affectedAreas: location,
            confidence: extremeSignals > 0 ? 92 : weatherCount > 0 || quakeCount > 0 ? 82 : 74,
            summary: extremeSignals > 0
                ? 'Severe alert signals detected; immediate readiness actions are recommended.'
                : weatherCount > 0 || quakeCount > 0
                    ? 'Active hazard signals detected; continue close monitoring and preparedness actions.'
                    : 'No immediate hazard indicators detected at this time.',
        };

        return this.callOpenAI<ThreatAssessment>([
            {
                role: 'system',
                content: 'You are an emergency risk analyst. Return valid JSON only with keys: relevance, severity, affectedAreas, confidence, summary.',
            },
            {
                role: 'user',
                content: `Location: ${location}\nWeather Alerts: ${JSON.stringify(weatherData)}\nEarthquake Alerts: ${JSON.stringify(earthquakeData)}\nAssess risk.`,
            },
        ], fallback);
    }

    async generateEmergencyInsights(weatherData: any, earthquakeData: any[]): Promise<EmergencyInsights> {
        const weatherAlerts = Array.isArray(weatherData) ? weatherData : [];
        const quakeAlerts = Array.isArray(earthquakeData) ? earthquakeData : [];
        const severeCount = [...weatherAlerts, ...quakeAlerts].filter(
            (item: any) => item.severity === AlertSeverity.SEVERE || item.severity === AlertSeverity.EXTREME
        ).length;

        const fallback: EmergencyInsights = severeCount > 0
            ? {
                status: 'Emergency',
                message: 'High-severity hazards are active. Immediate protective actions are advised.',
                recommendations: [
                    'Activate incident coordination and verify responder availability.',
                    'Push immediate public guidance for sheltering or evacuation.',
                    'Track hospital and shelter capacity every 15 minutes.',
                ],
            }
            : weatherAlerts.length + quakeAlerts.length > 0
                ? {
                    status: 'Warning',
                    message: 'Active hazard indicators detected. Stay alert and keep response assets ready.',
                    recommendations: [
                        'Monitor official alerts and operational dashboards continuously.',
                        'Prepare escalation messaging for impacted zones.',
                        'Validate critical infrastructure readiness status.',
                    ],
                }
                : {
                    status: 'All Clear',
                    message: 'No immediate high-risk hazard indicators are active.',
                    recommendations: [
                        'Continue routine monitoring of official feeds.',
                        'Review preparedness resources with community members.',
                        'Validate emergency communication channels daily.',
                    ],
                };

        return this.callOpenAI<EmergencyInsights>([
            {
                role: 'system',
                content: 'You are an emergency operations AI. Return valid JSON with keys: status, message, recommendations.',
            },
            {
                role: 'user',
                content: `Weather data: ${JSON.stringify(weatherData)}\nEarthquake data: ${JSON.stringify(earthquakeData)}\nGenerate concise operational guidance.`,
            },
        ], fallback);
    }

    async generateDynamicNews(location: string): Promise<DynamicNews[]> {
        const fallback: DynamicNews[] = [
            {
                title: `Emergency coordinators issue preparedness reminder for ${location}`,
                category: 'Safety',
                time: '1 hour ago',
                img: 'https://images.unsplash.com/photo-1510442650500-93217e634e4c?w=600&h=400&fit=crop',
            },
            {
                title: `Traffic control updates released for evacuation corridors near ${location}`,
                category: 'Traffic',
                time: '3 hours ago',
                img: 'https://images.unsplash.com/photo-1541888946425-d81bb19440f4?w=600&h=400&fit=crop',
            },
            {
                title: `Community volunteers mobilized to support relief logistics in ${location}`,
                category: 'Community',
                time: '6 hours ago',
                img: 'https://images.unsplash.com/photo-1511673319455-2117e221146c?w=600&h=400&fit=crop',
            },
        ];

        const result = await this.callOpenAI<{ news: DynamicNews[] }>([
            {
                role: 'system',
                content: 'Return valid JSON with key "news" as an array of 3 items. Each item must have title, category, time, img.',
            },
            {
                role: 'user',
                content: `Create realistic emergency management news updates for ${location}.`,
            },
        ], { news: fallback });

        return Array.isArray(result.news) && result.news.length > 0 ? result.news : fallback;
    }

    async generateSocialMediaPosts(location: string = 'your area'): Promise<SocialMediaAlert[]> {
        const prompt = `Generate 5 realistic social media posts (X, Facebook, Instagram) about a current emergency or safety situation in ${location}. 
        Return a JSON object with a "posts" array. Each post must follow the SocialMediaAlert interface:
        - id: string
        - source: "social_media"
        - platform: "X" | "Facebook" | "Instagram"
        - severity: "info" | "low" | "moderate" | "high" | "severe" | "extreme"
        - title: string (short catchy summary)
        - description: string (the actual post content)
        - author: string
        - handle: string (optional)
        - timestamp: ISO string (recent)
        - engagement: { likes: number, shares: number }`;

        const fallback: { posts: SocialMediaAlert[] } = { posts: [] };
        const result = await this.callOpenAI<{ posts: any[] }>([{ role: 'system', content: 'You are an emergency management AI.' }, { role: 'user', content: prompt }], { posts: [] });
        
        return (result.posts || []).map(p => ({
            ...p,
            source: AlertSource.SOCIAL_MEDIA,
            timestamp: p.timestamp || new Date().toISOString(),
        })) as SocialMediaAlert[];
    }

    async generateFuelStatus(location: string = 'your area'): Promise<ResourceAlert[]> {
        const prompt = `Generate 4 realistic gas station fuel availability reports for ${location} during an emergency.
        Return a JSON object with a "reports" array. Each report must follow the ResourceAlert interface:
        - id: string
        - source: "gas_buddy"
        - resourceType: "fuel"
        - severity: "info" | "low" | "moderate" | "high"
        - title: string (Station name, e.g. "Chevron on 5th")
        - description: string (Detailed status, e.g. "Has regular and diesel, premium sold out")
        - subTitle: string (Quick price/status, e.g. "$4.55/gal - Normal lines")
        - status: "available" | "limited" | "closed"
        - locationName: string (Specific address or cross streets)
        - timestamp: ISO string (now)
        - coordinates: { lat: number, lon: number } (make them near ${location})`;

        const fallback: { reports: any[] } = { reports: [] };
        const result = await this.callOpenAI<{ reports: any[] }>([{ role: 'system', content: 'You are an emergency resource tracking AI.' }, { role: 'user', content: prompt }], fallback);
        return (result.reports || []).map(r => ({
            ...r,
            source: AlertSource.GAS_BUDDY,
            timestamp: r.timestamp || new Date().toISOString(),
        })) as ResourceAlert[];
    }

    async generateLodgingStatus(location: string = 'your area'): Promise<ResourceAlert[]> {
        const prompt = `Generate 4 realistic hotel/shelter availability reports for ${location} during an emergency.
        Return a JSON object with a "reports" array. Each report must follow the ResourceAlert interface:
        - id: string
        - source: "hotel_api"
        - resourceType: "lodging"
        - severity: "info" | "low" | "moderate" | "high"
        - title: string (Hotel name, e.g. "Hilton Downtown")
        - description: string (Room status, e.g. "Pet friendly, 5 king rooms remaining")
        - subTitle: string (Quick status, e.g. "Open - 12 rooms left")
        - status: "available" | "limited" | "closed"
        - locationName: string (Specific address)
        - timestamp: ISO string (now)
        - coordinates: { lat: number, lon: number } (make them near ${location})`;

        const fallback: { reports: any[] } = { reports: [] };
        const result = await this.callOpenAI<{ reports: any[] }>([{ role: 'system', content: 'You are an emergency lodging coordinator AI.' }, { role: 'user', content: prompt }], fallback);
        return (result.reports || []).map(r => ({
            ...r,
            source: AlertSource.HOTEL_API,
            timestamp: r.timestamp || new Date().toISOString(),
        })) as ResourceAlert[];
    }

    async generatePreparednessTips(location: string, weatherData: any): Promise<PreparednessTip[]> {
        const fallback: PreparednessTip[] = [
            { title: 'Communication Readiness', desc: 'Keep emergency contacts and check-in channels updated.' },
            { title: 'Supplies Check', desc: 'Maintain a 72-hour supply of water, food, and essential medications.' },
            { title: 'Evacuation Awareness', desc: 'Confirm your primary and backup evacuation routes.' },
        ];

        const result = await this.callOpenAI<{ tips: PreparednessTip[] }>([
            {
                role: 'system',
                content: 'Return valid JSON with key "tips" as an array of 3 concise preparedness tips.',
            },
            {
                role: 'user',
                content: `User location: ${location}. Weather context: ${JSON.stringify(weatherData)}. Generate practical preparedness tips.`,
            },
        ], { tips: fallback });

        return Array.isArray(result.tips) && result.tips.length > 0 ? result.tips : fallback;
    }

    async generateEOCInsights(incidentStats: any, alertStats: any): Promise<string[]> {
        const fallback = [
            'Monitor severe alerts and responder availability continuously.',
            'Prioritize zones with rising incident and alert density.',
            'Review shelter and medical resource capacity every cycle.',
        ];

        const result = await this.callOpenAI<{ insights: string[] }>([
            {
                role: 'system',
                content: 'Return valid JSON with key "insights" as an array of 3 short operational insights.',
            },
            {
                role: 'user',
                content: `Incident stats: ${JSON.stringify(incidentStats)}\nAlert stats: ${JSON.stringify(alertStats)}\nGenerate 3 concise operational insights.`,
            },
        ], { insights: fallback });

        return Array.isArray(result.insights) && result.insights.length > 0 ? result.insights : fallback;
    }

    async generateAfterActionInsights(context: {
        incidentType: string;
        timelineEvents: number;
        incidentReports: number;
        highSeverityAlerts: number;
    }): Promise<AfterActionInsight[]> {
        const fallback: AfterActionInsight[] = [
            {
                id: 'AAR-001',
                category: 'Response Efficiency',
                description: 'Track dispatch-to-arrival delay trends for rapid response optimization.',
                status: 'Pending',
            },
            {
                id: 'AAR-002',
                category: 'Communication',
                description: 'Increase early-stage public messaging cadence during hazard escalation.',
                status: 'Addressed',
            },
            {
                id: 'AAR-003',
                category: 'Resource Allocation',
                description: 'Pre-stage medical and shelter resources in historically impacted zones.',
                status: 'Pending',
            },
        ];

        const result = await this.callOpenAI<{ insights: AfterActionInsight[] }>([
            {
                role: 'system',
                content: 'Return valid JSON with key "insights" as an array. Each item has id, category, description, status ("Pending" or "Addressed").',
            },
            {
                role: 'user',
                content: `Generate after-action insights for incident context: ${JSON.stringify(context)}.`,
            },
        ], { insights: fallback });

        return Array.isArray(result.insights) && result.insights.length > 0 ? result.insights : fallback;
    }

    buildSignalsFromAlertSet(alerts: Alert[], incidentCount: number, safeCheckins: number, totalUsers: number): OperationalSignals {
        return this.detectOperationalSignals({
            alerts,
            incidentCount,
            safeCheckins,
            totalUsers,
        });
    }

    async generateCountryStatus(country: string, weatherData: any, earthquakeData: any[]): Promise<{
        summary: string;
        suggestedType?: string;
        suggestedMessage?: string;
    }> {
        const fallback = {
            summary: `Stability report for ${country}: Monitoring active hazards. Weather alerts are currently present in some sectors. No major seismic activity impacting operations.`,
            suggestedType: 'Severe Thunderstorm Warning',
            suggestedMessage: `Official NWS Alert for ${country}: Severe weather detected in region. Please monitor local conditions and follows safety protocols.`
        };

        try {
            const result = await this.callOpenAI<{ 
                summary: string; 
                suggestedType: string; 
                suggestedMessage: string;
            }>([
                {
                    role: 'system',
                    content: 'You are a global emergency intelligence officer. Analyze the provided weather and earthquake data for the country and provide: 1) A concise professional summary. 2) A suggested NWS Alert Type from standard categories. 3) A drafted alert message (max 160 chars). Return valid JSON with keys: summary, suggestedType, suggestedMessage.',
                },
                {
                    role: 'user',
                    content: `Country: ${country}\nWeather Data: ${JSON.stringify(weatherData)}\nEarthquake Data: ${JSON.stringify(earthquakeData)}\nProvide intelligence report.`,
                },
            ], fallback);

            return {
                summary: result.summary || fallback.summary,
                suggestedType: result.suggestedType || fallback.suggestedType,
                suggestedMessage: result.suggestedMessage || fallback.suggestedMessage
            };
        } catch (error) {
            return fallback;
        }
    }

    async generateAlertLanguage(alertType: string, context?: string): Promise<string> {
        const fallback = `EMERGENCY ALERT: A ${alertType} has been issued. Seek shelter and monitor local communications for updates.`;

        try {
            const result = await this.callOpenAI<{ message: string }>([
                {
                    role: 'system',
                    content: 'You are an official Emergency Response Communications Officer. Generate a professional, authoritative, and concise emergency alert message (max 160 characters for SMS compatibility). Return JSON with key "message".',
                },
                {
                    role: 'user',
                    content: `Alert Type: ${alertType}\n${context ? `Additional Context: ${context}` : ''}\nGenerate the alert message.`,
                },
            ], { message: fallback });

            return result.message || fallback;
        } catch (error) {
            return fallback;
        }
    }

    splitAlertsBySource(alerts: Alert[]): { weather: Alert[]; earthquakes: Alert[]; social: Alert[]; resources: Alert[] } {
        return {
            weather: alerts.filter(alert => alert.source === AlertSource.WEATHER_API),
            earthquakes: alerts.filter(alert => alert.source === AlertSource.EARTHQUAKE_API),
            social: alerts.filter(alert => alert.source === AlertSource.SOCIAL_MEDIA),
            resources: alerts.filter(alert => alert.source === AlertSource.GAS_BUDDY || alert.source === AlertSource.HOTEL_API),
        };
    }
}

export const openaiService = new OpenAIService();

