import router from '@adonisjs/core/services/router'

router.get('/', async () => 'It works!')

const AuthController = () => import('#controllers/auth_controller')
const BypassController = () => import('#controllers/bypass_controller')
const MocksController = () => import('#controllers/mocks_controller')

router.post('/auth/login', [AuthController, 'login'])
router.get('/pets', [BypassController, 'index'])
router.post('/pet', [BypassController, 'create'])
router.get('/mocks', [MocksController, 'index'])
