import { config } from "dotenv"
import { resolve } from "node:path"
import express from 'express'
import { AppError, errorHandler, httpLogger, logger, successResponse } from "shared"

config({path: resolve(process.cwd(), '.env')})
config({path: resolve(process.cwd(), '../../.env')})

const PORT = process.env.WORKFLOW_PORT || 3004;

const app = express()

app.use(httpLogger)
app.use(express.json())

app.get('/health', (_req, res) => {
    successResponse(res, {service: 'workflow-service'})
})

app.use((_req, _res, next) => {
    next(new AppError(404, 'Route not found'))
})

app.use(errorHandler)

app.listen(PORT, () => {
        logger.info(`Workflow service is running on port ${PORT}`)
    })