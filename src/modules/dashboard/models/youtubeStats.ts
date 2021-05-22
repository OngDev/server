import db from '@/db';

const youtubeStatsModel = db.get('youtube-stats');

youtubeStatsModel.createIndex({loggedAt: 1})
export default youtubeStatsModel;