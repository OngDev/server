import axios from 'axios';
import log from "@/logger"
import { messageModel, authorModel } from "./model"
import { YoutubeConfig } from '@/env';
import io from '@/server';
import { AuthorDetails, MessageDetails, MessageType, MessageTypeEnum, YoutubeLiveMessageListResponse, YoutubeLiveMessageType, YoutubeMessageFetchPagination } from './types';
import { getCurrentLivechatId } from './helpers.js';

const { API_KEY, MESSAGE_API_URL } = YoutubeConfig;
let isFetchingMessages = false;

const pagingInfo: YoutubeMessageFetchPagination = {
    pollingIntervalMillis: undefined,
    nextPageToken: undefined,
    liveChatId: undefined,
    isFetchingMessages: false
};

export function stopFetching(): void {
    pagingInfo.liveChatId = undefined;
    pagingInfo.isFetchingMessages= false
}

export async function initialize(): Promise<boolean> {
    try {
        const newLiveChatId = await getCurrentLivechatId()
        log.info(`New livechatId: ${newLiveChatId}`)
        if (newLiveChatId && newLiveChatId !== "") {
            if (newLiveChatId !== pagingInfo.liveChatId) {
                pagingInfo.liveChatId = newLiveChatId;
                await fetchMessages();
            } else if (!isFetchingMessages) {
                await fetchMessages(pagingInfo.nextPageToken);
            }
            return true;
        }
        
    } catch (error) {
        log.error(error.message);
    }
    isFetchingMessages = false;
    return false;
}

export async function fetchMessages(pageToken = ""): Promise<void> {
    const { liveChatId } = pagingInfo;
    if(!liveChatId || liveChatId === "") {
        log.error("Livechat Id is empty")
        return;
    }
    log.info({ pageToken });
    isFetchingMessages = true;
    let ENDPOINT =
        `${MESSAGE_API_URL}?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${API_KEY}&maxResults=200`;
    if (pageToken) {
        ENDPOINT += `&pageToken=${pageToken}`;
    }
    try {
        const response = await axios.get(ENDPOINT);
        const liveChatMessageListResponse: YoutubeLiveMessageListResponse = await response.data;
        const { pollingIntervalMillis, nextPageToken, items, offlineAt } = liveChatMessageListResponse;

        if(offlineAt) {
            stopFetching();
            return;
        }

        pagingInfo.pollingIntervalMillis = pollingIntervalMillis;
        pagingInfo.nextPageToken = nextPageToken;
        if (items && items.length !== 0) {
            processMessages(items);
        }

    } catch (error) {
        log.error(error.message || error.response?.data?.message);
    }


    setTimeout(async () => {
        log.info({ pageToken, pollingIntervalMillis: pagingInfo.pollingIntervalMillis })
        await fetchMessages(pagingInfo.nextPageToken)
    }, pagingInfo.pollingIntervalMillis);
}

async function processMessages (items: YoutubeLiveMessageType[]): Promise<void> {
    try {
        for (let index = 0; index < items.length; index++) {
            const { id, snippet, authorDetails } = items[index];
            const { liveChatId, publishedAt, displayMessage } = snippet;
            const { channelId, displayName, profileImageUrl, isChatOwner, isChatSponsor, isChatModerator } = authorDetails;
    
            // Find author
            const existedAuthor: AuthorDetails = await authorModel.findOne({channelId});
            if (!existedAuthor) {
                const author: AuthorDetails = {
                    channelId,
                    name: displayName,
                    avatarUrl: profileImageUrl,
                    // role: "chauongdev"
                    role: "👶"
                };
    
                if (isChatOwner) {
                    author.role = "👑";
                }
    
                if (isChatModerator) {
                    author.role = "🔧";
                }
    
                if (isChatSponsor) {
                    author.role = "💎";
                }
    
                await authorModel.insert(author);
                io.emit("New author", author);
            }
            let messageType = MessageTypeEnum.TEXT;
            if (displayMessage.includes("!" + MessageTypeEnum.HI)) {
                messageType = MessageTypeEnum.HI;
            } else if (displayMessage.includes("!" + MessageTypeEnum.QNA)) {
                messageType = MessageTypeEnum.QNA;
            }
            const message: MessageDetails = {
                liveChatId,
                messageId: id,
                text: displayMessage,
                authorId: channelId,
                publishedAt,
                messageType,
                isResolved: false
            };
            await messageModel.insert(message);
            io.emit("New message", message);
        }
    } catch (error) {
        log.error(error.message);
    }
}

export async function getMessages(type: MessageType | string): Promise<MessageDetails[] | []> {
    try {
        return await messageModel.find({
            messageType: type,
            livechatId: pagingInfo.liveChatId,
            isResolved: false
        })
    } catch (error) {
        log.error(error.message);
        return [];
    }
    
}
export async function getAuthors(): Promise<AuthorDetails[]> {
    try {
        return await authorModel.find({});
    } catch (error){
        log.error(error.message);
        return [];
    }
    
}

export async function archiveMessage(messageId: string): Promise<boolean> {
    try {
        await messageModel.findOneAndUpdate({messageId},{isResolved: true})
        return true;
    } catch (error) {
        log.error(error.message);
        return false;
    }
    
}
