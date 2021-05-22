import db from '@/db';

const authorModel = db.get('authors');

authorModel.createIndex({channelId: 1}, {unique: true})
export default authorModel;