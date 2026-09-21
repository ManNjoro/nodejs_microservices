import type { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import * as workflowService from '../services/workflow.services'

function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!role || !userId) {
    throw new AppError(401, "Missing user identity");
  }

  return { userId, role };
}

export async function listWorkflowsByTask(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const { role, userId} = requireIdentity(req)
        const taskId = String(req.params.taskId)
        const workflows = await workflowService.listWorkFlowsByTask(taskId, userId, role)
        successResponse(res, { workflows });
    } catch (error) {
        next(error)
    }
}