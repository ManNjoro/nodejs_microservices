import type { NextFunction, Request, Response} from 'express'
import * as taskService from '../services/task.services'
import { AppError, successResponse } from 'shared'


function requireIdentity(req: Request) {
    const userId = req.header('x-user-id')
    const role = req.header('x-user-role')

    if(!role || !userId) {
        throw new AppError(401, 'Missing user identity');
    }

    return {userId, role}
}

export async function createTask(req: Request, res: Response, next: NextFunction){
    try {
        const {userId} = requireIdentity(req)
        const task = await taskService.createTask(req.body, userId);
        successResponse(res, { task }, 201)
    } catch (error) {
        next(error)
    }
}

export async function listTasks(req: Request, res: Response, next: NextFunction){
    try {
        const {role, userId} = requireIdentity(req)
        const tasks = await taskService.listTasks(userId, role)

        successResponse(res, { tasks})
    } catch (error) {
        next(error)
    }
}
export async function getSingleTask(req: Request, res: Response, next: NextFunction){
    try {
        
    } catch (error) {
        next(error)
    }
}
export async function deleteSingleTask(req: Request, res: Response, next: NextFunction){
    try {
        
    } catch (error) {
        next(error)
    }
}