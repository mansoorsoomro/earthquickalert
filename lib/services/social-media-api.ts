import { SocialMediaAlert } from '@/lib/types/api-alerts';
import { openaiService } from './openai-service';

export class SocialMediaAPIService {
  /**
   * Fetch recent social media posts related to emergencies
   * Fetches dynamically from OpenAI as requested.
   */
  async fetchAlerts(location?: { lat: number; lon: number }): Promise<SocialMediaAlert[]> {
    try {
      const locStr = location ? `${location.lat}, ${location.lon}` : undefined;
      const posts = await openaiService.generateSocialMediaPosts(locStr);
      return posts;
    } catch (error) {
      console.error('Error fetching social media alerts:', error);
      return [];
    }
  }
}

export const socialMediaAPI = new SocialMediaAPIService();
