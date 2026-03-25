import { ResourceAlert } from '../types/api-alerts';
import { openaiService } from './openai-service';

export class GasBuddyService {
    async fetchFuelStatus(location: string = 'your area'): Promise<ResourceAlert[]> {
        try {
            return await openaiService.generateFuelStatus(location);
        } catch (error) {
            console.error('Error fetching fuel status:', error);
            return [];
        }
    }
}

export const gasBuddyService = new GasBuddyService();
