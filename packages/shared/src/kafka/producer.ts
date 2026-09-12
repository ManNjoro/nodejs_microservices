import { Producer } from "kafkajs";
import { logger } from "../logger/logger";
import { createKafkaClient } from "./client";

export async function createProducer(clientId: string): Promise<Producer> {
    const kafka = createKafkaClient(clientId)
    // responsible for sending records/data to the kafka topics
    const producer = kafka.producer()

    await producer.connect()

    logger.info({clientId}, 'kafka producer connected')
    return producer;
}