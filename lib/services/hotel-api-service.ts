import { ResourceAlert } from '../types/api-alerts';
import { openaiService } from './openai-service';

export class HotelAPIService {
    async fetchHotelStatus(location: string = 'your area'): Promise<ResourceAlert[]> {
        try {
            return await openaiService.generateLodgingStatus(location);
        } catch (error) {
            console.error('Error fetching hotel status:', error);
            return [];
        }
    }
}

export const hotelAPIService = new HotelAPIService();
