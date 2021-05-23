import axios from 'axios';
import moment from 'moment';
import youtubeStatsModel from './models/youtubeStats';
import githubStatsModel from './models/githubStats';
import { YoutubeConfig, GITHUB_API_URL } from '@/env';
import log from '@/logger';
import { GithubStats, YoutubeStats } from './types';

const { CHANNEL_API_URL, YOUTUBE_CHANNEL_ID, API_KEY } = YoutubeConfig;

export async function fetchYoutubeStats(): Promise<void> {
  const ENDPOINT = `${CHANNEL_API_URL}?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${API_KEY}`;
  try {
    const response = await axios.get(ENDPOINT);
    const channel = response.data.items[0];
    const {
      statistics: { viewCount, subscriberCount, videoCount },
    } = channel;
    const now = moment()
    const today = now.toDate();
    const startOfDate = now.startOf('day').toDate()
    const endOfDate = now.endOf('day').toDate()
    await youtubeStatsModel.findOneAndUpdate(
      {
        loggedAt: {
          $gte: startOfDate,
          $lt: endOfDate,
        },
      },
      {
        $set: {
          viewCount: +viewCount,
          subscriberCount: +subscriberCount,
          videoCount: +videoCount,
          loggedAt: today,
        },
      },
      { upsert: true },
    );
    log.info(`Updated Youtube stats for date: ${today}`);
  } catch (error) {
    log.error(error.message);
  }
}

export async function fetchGithubStats(): Promise<void> {
  try {
    const USER_ENDPOINT = `${GITHUB_API_URL}users/milonguyen95`;
    const response = await axios.get(USER_ENDPOINT);
    const { public_repos, public_gists, followers } = response.data;
    const now = moment()
    const today = now.toDate();
    const startOfDate = now.startOf('day').toDate()
    const endOfDate = now.endOf('day').toDate()

    await githubStatsModel.findOneAndUpdate(
      {
        loggedAt: {
          $gte: startOfDate,
          $lt: endOfDate,
        },
      },
      {
        $set: {
          repoCount: +public_repos,
          gistCount: +public_gists,
          followerCount: +followers,
          loggedAt: today,
        },
      },
      { upsert: true },
    );
    log.info(`Updated Github stats for date: ${today}`);
  } catch (error) {
    log.error(error.message);
  }
}

export async function getYoutubeStats(): Promise<YoutubeStats> {
  try {
    const today = moment().toDate();
    const stats = await youtubeStatsModel.find(
      {},
      {
        sort: {
          loggedAt: -1,
        },
        limit: 1,
      },
    );
    if (!stats || stats.length === 0) {
      log.info(`No youtube stats fetched on ${today}`);
      log.info(`Calling youtube stats fetch`);
    }
    const { viewCount, subscriberCount, videoCount } = stats[0];
    return {
      viewCount,
      subscriberCount,
      videoCount,
    };
  } catch (error) {
    log.error(error.message);
  }
}

export async function getGithubStats(): Promise<GithubStats> {
  try {
    const today = moment().toDate();
    const stats = await githubStatsModel.find(
      {},
      {
        sort: {
          loggedAt: -1,
        },
        limit: 1,
      },
    );
    if (!stats || stats.length === 0) {
      log.info(`No github stats fetched on ${today}`);
      log.info(`Calling youtube stats fetch`);
    }
    const { repoCount, gistCount, followerCount } = stats[0];
    return {
      repoCount,
      gistCount,
      followerCount,
    };
  } catch (error) {
    log.error(error.message);
  }
}