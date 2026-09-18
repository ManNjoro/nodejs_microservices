import { getPool } from "shared";
import { Workflow } from "../utils/types";

export async function createWorkflow(input: {
    taskId: string;
    eventType: string;
    message: string;
    createdBy: string
}): Promise<Workflow> {
    const result = await getPool().query<Workflow>(
        `
        INSERT INTO task_workflows (task_id, event_type, message, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING id, task_id, event_type, message, created_by, created_at
        `,
        [input.taskId, input.eventType, input.message, input.createdBy]
    )
    return result.rows[0]
}