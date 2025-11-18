import { saveMessage, getMessagesByRoom } from '../models/Message';
import { Message, MessagePayload } from '../types/message.types';

export const createMessage = async (messageData: MessagePayload): Promise<Message> => {
  if (!messageData.text || messageData.text.trim().length === 0) {
    throw new Error('Message text cannot be empty');
  }

  if (!messageData.roomId) {
    throw new Error('Room ID is required');
  }

  return await saveMessage(messageData);
};

export const fetchMessages = async (roomId: string, limit: number = 50): Promise<Message[]> => {
  if (!roomId) {
    throw new Error('Room ID is required');
  }

  const messages = await getMessagesByRoom(roomId, limit);
  return messages.reverse();
};
