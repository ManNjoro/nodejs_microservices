import { AppError, getPool } from "shared";
import * as attachmentRepo from '../repositories/media.repositories'
import { uploadBuffer } from "../utils/storage";
import { convertToPublicMediaAttachment } from "../utils/media.utils";


async function assertTaskAccess(
    taskId: string,
    userId: string,
    role: string
) { 
    const task = await attachmentRepo.findTaskAccess(taskId)
    if(!task){
        throw new AppError(404, 'Task not found')
    }

    if(role !== 'ADMIN' && task.created_by !== userId){
        throw new AppError(403, 'Forbidden. You are not authorized to perform the operation')
    }
}

export async function uploadAttachment(input: {
    taskId: string;
    userId: string;
    role: string;
    file?: Express.Multer.File
}) {
    if(!input.file){
        throw new AppError(400, 'Image file is requires')
    }

    await assertTaskAccess(input.taskId, input.userId, input.role)

    const uploaded = await uploadBuffer(
        input.file.buffer,
        input.file.mimetype || 'image/jpeg'
    )

    const attachment = await attachmentRepo.createAttachment({
        taskId: input.taskId,
        imageUrl: uploaded.imageUrl,
        publicId: uploaded.publicId,
        uploadedBy: input.userId
    })

    return convertToPublicMediaAttachment(attachment)
}

export async function listAttachments(
    taskId: string,
    userId: string,
    role: string
){
    await assertTaskAccess(taskId, userId, role)
    const rows = await attachmentRepo.listByTaskId(taskId)

    return rows.map(convertToPublicMediaAttachment)
}