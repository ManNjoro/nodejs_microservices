import { createConsumer, logger, runConsumer, TOPICS } from "shared";
import { DomainEvent } from "../utils/types";
import * as workflowRepo from '../repositories/workflow.repositories'

async function handleDomainEvent(rawData: DomainEvent){
    if(!rawData.eventType || !rawData.taskId || !rawData.userId){
        logger.warn({rawData}, 'Invalid domain event')
        return
    }

    const workflow = await workflowRepo.createWorkflow({
        taskId: rawData.taskId,
        eventType: rawData.eventType,
        createdBy: rawData.userId,
        message: rawData.message || rawData.eventType
    })

    logger.info({
        workflowId: workflow.id, eventType: workflow.event_type
    }, 'workflow row created')
}

export async function startKafka() {
    const consumer = await createConsumer(
        'workflow-service',
        'workflow-service-group'
    )

    void runConsumer(
        consumer,
        [TOPICS.TASK_EVENTS, TOPICS.MEDIA_EVENTS],
        async({ message }) => {
            const value = message.value?.toString();
            if(!value) return;

            try {
                await handleDomainEvent(JSON.parse(value) as DomainEvent)
            } catch (error) {
                logger.error({error}, 'workflow consumer failed')
            }
        }
    )
}