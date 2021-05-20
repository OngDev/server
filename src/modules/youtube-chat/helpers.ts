import axios from 'axios';
import { YoutubeConfig } from '@/env';
import { YouTubeSearchResponse,YouTubeVideoListResponse } from "./types";

const { API_KEY, YOUTUBE_CHANNEL_ID, SEARCH_API_URL, VIDEO_API_URL } = YoutubeConfig;

export async function getCurrentLivechatId(): Promise<string | null> {
    if(!YOUTUBE_CHANNEL_ID) {
        throw new Error("Youtube channel Id is undefined.")
    }
    const liveVideoIds = await searchChannelForLiveVideoIds(YOUTUBE_CHANNEL_ID);
    const currentLiveVideoId = liveVideoIds[0];
    if (!currentLiveVideoId) throw new Error("Cannot find any live video Id");
    return await getLiveChatIdFromVideoId(currentLiveVideoId);
}
    
async function searchChannelForLiveVideoIds(channelId: string): Promise<string[]> {
    if(!API_KEY) {
        throw new Error("Youtube Api Key is undefined")
    }
    const resp = await axios.get(SEARCH_API_URL, {params: {
        eventType: 'live',
        part: 'id',
        channelId,
        type: 'video',
        key: API_KEY,
    }});
    const respData = resp.data as YouTubeSearchResponse;
    return respData.items.map((i: any) => i.id.videoId);
  }

  async function getLiveChatIdFromVideoId(id: string) {
    if(!API_KEY) {
        throw new Error("Youtube Api Key is undefined")
    }
    const resp = await axios.get(VIDEO_API_URL, {params: {
        part: 'liveStreamingDetails',
        id,
        key: API_KEY,
    }});
    const respData = resp.data as YouTubeVideoListResponse;
    if (respData.items.length === 1) {
      return respData.items[0].liveStreamingDetails.activeLiveChatId;
    } else if (respData.items.length === 0) {
      return null;
    } else {
      throw new Error(`How are there ${respData.items.length} videos with the same ID (${id}) ?!?!`);
    }
  }

