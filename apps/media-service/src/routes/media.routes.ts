import { NextFunction, Router, type Request, type Response} from 'express'
import * as attachmentController from '../controllers/media.controllers'
import { FILE_SIZE_LIMIT, uploadImage } from '../middleware/upload.middleware'
import { AppError } from 'shared'

const router = Router()

function handleUpload(req: Request, res: Response, next: NextFunction){
    uploadImage(req, res, (err: unknown) => {
        if(!err){
            return next()
        }

        if(err instanceof AppError){
            return next(err)
        }

        if(typeof err === 'object'
            && err !== null &&
            'code' in err &&
            err.code === 'LIMIT_FILE_SIZE'
        ) {
            return next(new AppError(400, `Image must be ${FILE_SIZE_LIMIT}MB or smaller`))
        }
        return next(new AppError(400, 'Invalid image upload'))
    })
}

router.post('/:taskId/attachments', handleUpload, attachmentController.uploadAttachment)

export default router;