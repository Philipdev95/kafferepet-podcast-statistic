// src/app/podchaser.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PodchaserService {
  private apiKeyDev = '952f3b33-85ed-4fca-9458-017d6e2ee512';
  private apiKeyProd = '952f3b33-9fe1-4146-89fd-26a78e61eb35';
  private podChaserKey = this.apiKeyDev;
  private apiUrl = 'https://api.podchaser.com';
  private apiKey = this.podChaserKey;  // Ersätt med din API-nyckel

  constructor() {}

  async getEpisodeDetails(podcastId: string, episodeId: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/podcasts/${podcastId}/episodes/${episodeId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching episode details:', error);
      throw error;
    }
  }

  async searchEpisodeByName(podcastId: string, episodeName: string) {
    console.log(`Searching for episode: ${episodeName} in podcastId: ${podcastId}`);
    try {
      const response = await axios.get(`${this.apiUrl}/search/episodes`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          query: episodeName,
          podcast_id: podcastId
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching for episode:', error);
      throw error;
    }
  }

}
