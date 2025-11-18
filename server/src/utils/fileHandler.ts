import fs from 'fs';
import path from 'path';
import { IncomingMessage } from 'http';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const saveFile = async (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    writeStream.on('finish', () => {
      resolve(`/uploads/${fileName}`);
    });

    writeStream.on('error', (error) => {
      reject(error);
    });
  });
};

export const deleteFile = (fileUrl: string): void => {
  const fileName = path.basename(fileUrl);
  const filePath = path.join(UPLOAD_DIR, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
