import multer from 'multer'
import { AppError } from 'shared'

export const FILE_SIZE_LIMIT = 10
const FILE_SIZE_LIMIT_MB = FILE_SIZE_LIMIT * 1024 * 1024 // 10MB

export const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: FILE_SIZE_LIMIT_MB},
    fileFilter: (_req, file, cb) => {
        if(!file.mimetype.startsWith('image/')) {
            cb(new AppError(400, 'Only image uploads are allowed'))
            return;
        }
        cb(null, true)
    }
}).single('image') // fieldname we need to use