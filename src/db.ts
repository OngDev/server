import monk from 'monk';
import { MongoDbUrl } from './env';
import { logger, crashReporter, wrapNonDollarUpdateMiddleware } from './middlewares/query';

const db = monk(MongoDbUrl);
db.addMiddleware(logger);
db.addMiddleware(crashReporter);
db.addMiddleware(wrapNonDollarUpdateMiddleware)
export default db;