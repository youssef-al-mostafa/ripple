import { ObjectId } from 'mongodb';
import { getMessagesCollection } from '../config/database';
import { Message, MessagePayload } from '../types/message.types';

export const saveMessage = async (messageData: MessagePayload): Promise<Message> => {
  const message: Message = {
    ...messageData,
    timestamp: new Date(),
  };

  const result = await getMessagesCollection().insertOne(message);

  return {
    ...message,
    _id: result.insertedId,
  };
};

export const getMessagesByRoom = async (roomId: string, limit: number = 50): Promise<Message[]> => {
  return await getMessagesCollection()
    .find({ roomId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
};

export const deleteMessage = async (messageId: string): Promise<boolean> => {
  const result = await getMessagesCollection().deleteOne({ _id: new ObjectId(messageId) });
  return result.deletedCount > 0;
};
