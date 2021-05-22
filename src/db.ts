import monk from 'monk';
import { MongoDbUrl } from './env';
import { logger, crashReporter } from './middlewares/query';

const db = monk(MongoDbUrl);
db.addMiddleware(logger);
db.addMiddleware(crashReporter);
export default db;