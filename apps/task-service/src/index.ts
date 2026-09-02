import { config } from 'dotenv'
import { resolve } from 'node:path'
import express from 'express'
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successResponse } from 'shared'
import taskRoutes from './routes/task.routes'
config({path: resolve(process.cwd(), '.env')})
config({path: resolve(process.cwd(), '../../.env')})

const PORT = process.env.TASK_PORT || 3002;

const app = express()

app.use(httpLogger)
app.use(express.json())

app.get('/health', (_req, res) => {
    successResponse(res, {service: 'task-service'})
})

app.use('/tasks', requireGatewaySecret, taskRoutes)

app.use((_req, _res, next) => {
    next(new AppError(404, 'Route not found'))
})

app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`TASK service is running on port ${PORT}`)
})