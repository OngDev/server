import db from '@/db';

const messageModel = db.get('messages');

messageModel.createIndex({messageId: 1}, {unique: true})

export default messageModel