import { CreateTaskInput } from "../schemas/task.schemas";
import * as taskRepo from '../repositories/task.repository'
import { convertToPublicTask } from "../utils/task.utils";
import { AppError } from "shared";


export async function createTask(input: CreateTaskInput, userId: string){
    const newlyCreatedTask = await taskRepo.createTask({
        title: input.title,
        createdBy: userId
    })
    return convertToPublicTask(newlyCreatedTask)
}

export async function listTasks(userId: string, role: string) {
    if(!userId || !role){
        throw new AppError(401, 'Missing user identity');
    }

    const tasks = await taskRepo.listTasks({userId, role})

    return tasks.map(convertToPublicTask)
}