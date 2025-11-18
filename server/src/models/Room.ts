import { ObjectId } from 'mongodb';
import { getRoomsCollection } from '../config/database';

export interface Room {
  _id?: ObjectId;
  name: string;
  createdAt: Date;
}

export const createRoom = async (name: string): Promise<Room> => {
  const room: Room = {
    name,
    createdAt: new Date(),
  };

  const result = await getRoomsCollection().insertOne(room);

  return {
    ...room,
    _id: result.insertedId,
  };
};

export const getRooms = async (): Promise<Room[]> => {
  return await getRoomsCollection().find({}).toArray();
};

export const getRoomById = async (roomId: string): Promise<Room | null> => {
  return await getRoomsCollection().findOne({ _id: new ObjectId(roomId) });
};
