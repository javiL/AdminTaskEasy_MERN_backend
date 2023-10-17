import express from "express"
import checkAuth from "../middleware/checkAuth.js"

import {
    addTarea,
    getTarea,
    updateTarea,
    deleteTarea,
    changeStateTarea
} from '../controllers/tareaController.js'

const router = express.Router()

router.post('/', checkAuth, addTarea)
router.route('/:id').get(checkAuth, getTarea).put(checkAuth, updateTarea).delete(checkAuth, deleteTarea)

router.post('/estado/:id', checkAuth, changeStateTarea)


export default router