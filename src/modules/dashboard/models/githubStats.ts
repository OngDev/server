import db from '@/db';

const githubStatsModel = db.get('github-stats');

githubStatsModel.createIndex({loggedAt: 1})
export default githubStatsModel;