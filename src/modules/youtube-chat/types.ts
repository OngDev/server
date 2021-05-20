export interface YouTubeSearchResponse {
  kind: 'youtube#searchListResponse';
  etag: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  error?: YouTubeErrorObject;
  items: {
    kind: 'youtube#searchResult';
    etag: string;
    id: {
      kind: 'youtube#video';
      videoId: string;
    };
  }[];
}

export interface YouTubeVideoListResponse {
  kind: 'youtube#videoListResponse';
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  error?: YouTubeErrorObject;
  items: {
    kind: 'youtube#video';
    etag: string;
    id: string;
    liveStreamingDetails: {
      actualStartTime: string;
      scheduledStartTime: string;
      concurrentViewers: string; // WHY?!?!?
      activeLiveChatId: string;
    };
  }[];
}

export interface YouTubeErrorObject {
  code: number;
  message: string;
  errors: {
    message: string;
    domain: string;
    reason: string;
  }[];
}

export interface YoutubeLiveMessageType {
  kind: 'youtube#liveChatMessage';
  etag: string;
  id: string;
  snippet: {
    type: string;
    liveChatId: string;
    authorChannelId: string;
    publishedAt: string;
    hasDisplayContent: boolean;
    displayMessage: string;
  };
  authorDetails: {
    channelId: string;
    channelUrl: string;
    displayName: string;
    profileImageUrl: string;
    isVerified: boolean;
    isChatOwner: boolean;
    isChatSponsor: boolean;
    isChatModerator: boolean;
  };
}

export interface YoutubeLiveMessageListResponse {
  kind: 'youtube#liveChatMessageListResponse';
  etag: string;
  nextPageToken: string;
  pollingIntervalMillis: number;
  offlineAt: string;
  pageInfo: any;
  items: YoutubeLiveMessageType[];
}

export interface AuthorDetails {
  channelId: string;
  name: string;
  avatarUrl: string;
  role: string;
}

export interface MessageDetails {
  messageId: string;
  text: string;
  authorId: string;
  publishedAt: string;
  messageType: MessageType;
  isResolved: boolean;
  liveChatId: string;
}

export enum MessageTypeEnum {
  TEXT = 'text',
  HI = 'hi',
  QNA = 'qna',
}

export type MessageType = 'text' | 'hi' | 'qna';

export interface YoutubeConfigType {
  API_KEY: string;
  YOUTUBE_CHANNEL_ID: string;
  MESSAGE_API_URL: string;
  SEARCH_API_URL: string;
  VIDEO_API_URL: string;
}

export interface YoutubeMessageFetchPagination {
  pollingIntervalMillis: number | undefined,
  nextPageToken: string | undefined;
  liveChatId: string | undefined;
  isFetchingMessages: boolean | undefined;
}