import { Router } from 'express'
import { validateBody } from 'shared';
import { createTaskSchema } from '../schemas/task.schemas';
import  * as taskContoller from '../controllers/task.controllers'

const router = Router()

router.post('/', validateBody(createTaskSchema), taskContoller.createTask)

export default router;