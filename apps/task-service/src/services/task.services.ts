import { CreateTaskInput } from "../schemas/task.schemas";
import * as taskRepo from '../repositories/task.repository'
import { convertToPublicTask } from "../utils/task.utils";


export async function createTask(input: CreateTaskInput, userId: string){
    const newlyCreatedTask = await taskRepo.createTask({
        title: input.title,
        createdBy: userId
    })
    return convertToPublicTask(newlyCreatedTask)
}