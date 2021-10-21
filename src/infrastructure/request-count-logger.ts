import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
const LOG_FILE_PATH = 'logs/request-count.log';
export default function (req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    writeCount(readCount() + 1);
  });
  next();
}

function readCount(): number {
  try {
    const lastCount = parseInt(fs.readFileSync(LOG_FILE_PATH).toString());

    if (isNaN(lastCount)) {
      return 0;
    } else {
      return lastCount;
    }
  } catch (err) {
    return 0;
  }
}

function writeCount(count: number) {
  try {
    fs.writeFileSync(LOG_FILE_PATH, String(count), { flag: 'w+' });
  } catch (err) {
    console.error(err);
  }
}
