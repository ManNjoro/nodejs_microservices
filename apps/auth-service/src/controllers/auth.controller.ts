import type {NextFunction, Request, Response} from 'express'
import * as authservice from '../services/auth.service'
import { successResponse } from 'shared'
export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await authservice.register(req.body)
        successResponse(res, { user }, 201)
    } catch (error) {
        next(error)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authservice.login(req.body)
        successResponse(res, result)
    } catch (error) {
        next(error)
    }
}