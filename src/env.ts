import { YoutubeConfigType } from "./modules/youtube-chat/types";
import dotenv from 'dotenv';
dotenv.config();
export default function getEnv(key: string): string | undefined {
    return process.env[key];
}

export const PORT = getEnv('PORT') || 3000;


export function getYoutubeConfig(): YoutubeConfigType {
    const API_KEY = getEnv('YOUTUBE_API_KEY');
    const YOUTUBE_CHANNEL_ID = getEnv('YOUTUBE_CHANNEL_ID')
    const MESSAGE_API_URL = getEnv('MESSAGE_API_URL')
    const YOUTUBE_API_URL = getEnv('YOUTUBE_API_URL')

    if(!API_KEY || !YOUTUBE_CHANNEL_ID || !MESSAGE_API_URL || !YOUTUBE_API_URL) {
        throw new Error(`Some of youtube env var are missing, please check \n
        ApiKey: ${API_KEY}\n
        ChannelId: ${YOUTUBE_CHANNEL_ID}\n
        MessageApiUrl: ${MESSAGE_API_URL}\n
        YoutubeApiUrl: ${YOUTUBE_API_URL}`);
    }

    return {
        API_KEY,
        YOUTUBE_CHANNEL_ID,
        MESSAGE_API_URL,
        SEARCH_API_URL: `${YOUTUBE_API_URL}/search`,
        VIDEO_API_URL: `${YOUTUBE_API_URL}/videos`,
        CHANNEL_API_URL: `${YOUTUBE_API_URL}/channels`
    }
}

export function getMongoUrl(): string {
    const MONGO_DB_URL = getEnv('MONGO_DB_URL');
    if (!MONGO_DB_URL) {
        throw new Error(`Mongo db url is undefined.`);
    }
    return MONGO_DB_URL;
}

export function getGithubUrl(): string {
    const GITHUB_API_URL = getEnv('GITHUB_API_URL');
    if (!GITHUB_API_URL) {
        throw new Error(`Github api url is undefined.`);
    }
    return GITHUB_API_URL;
}

export const MongoDbUrl = getMongoUrl();

export const YoutubeConfig = getYoutubeConfig();

export const GITHUB_API_URL = getGithubUrl();
