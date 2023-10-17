import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

const addTarea = async (req, res) => {
    const { proyecto } = req.body

    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto) {
        const error = new Error('El proyecto no existe')
        return res.status(404).json({msg:error.message})
    }

    if (existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos para añadir tareas a este proyecto')
        return res.status(403).json({msg:error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        // Almacenar ID del Proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
}

const getTarea = async (req, res) => {
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({msg:error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no permitida')
        return res.status(403).json({msg:error.message})
    }

    res.json(tarea)
}

const updateTarea = async (req, res) => {
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({msg:error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no permitida')
        return res.status(403).json({msg:error.message})
    }

    //Coger el nombre de la tarea pasada por el request body JSON y en caso de que no esté el nombre, asigna el que ya tiene en la BBDD
    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }

}

const deleteTarea = async (req, res) => {

    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({msg:error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no permitida')
        return res.status(403).json({msg:error.message})
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
        
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

        res.json({msg:"La tarea ha sido eliminada"})
    } catch (error) {
        console.log(error)
    }

}

const changeStateTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({msg:error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString() )){
        const error = new Error('Acción no permitida')
        return res.status(403).json({msg:error.message})
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id 
    await tarea.save()

    const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate("completado")

    res.json(tareaAlmacenada)
    
}

export {
    addTarea,
    getTarea,
    updateTarea,
    deleteTarea,
    changeStateTarea
}