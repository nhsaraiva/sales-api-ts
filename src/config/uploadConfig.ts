import path from 'path';
import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
    driver: 's3' | 'disk';
    tmpFolder: string;
    directory: string;
    multer: {
        storage: StorageEngine;
    };
    config: {
        aws: {
            bucket: string;
        };
    };
}

export default {
    driver: process.env.STORAGE_DRIVER,
    directory: uploadFolder,
    tmpFolder,
    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');

                const filename = `${fileHash}-${file.originalname}`;

                callback(null, filename);
            },
        }),
    },
    config: {
        aws: {
            bucket: process.env.AWS_S3_BUCKET,
        },
    },
} as IUploadConfig;
