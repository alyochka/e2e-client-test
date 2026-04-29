import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const PetsController = () => import('#controllers/pets_controller')

router.post('/auth/login', [AuthController, 'login'])

router.get('/pets', [PetsController, 'index'])
router.post('/pet', [PetsController, 'create']).middleware(middleware.bearerAuth())

openapi.registerRoutes()
router.get('/docs', () => openapi.generateUi('/api'))
