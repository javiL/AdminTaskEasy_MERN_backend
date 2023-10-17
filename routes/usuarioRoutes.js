import express from "express";
const router = express.Router();
import {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioController.js'
import checkAuth from '../middleware/checkAuth.js'

//Autenticación, Registro y Confirmación de Usuarios
router.post('/', registrar) //Crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/recuperar-password', olvidePassword)
router.route('/recuperar-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil)

export default router