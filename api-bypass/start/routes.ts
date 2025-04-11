/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import axios from 'axios'

router.get('/', async () => 'It works!')

axios.defaults.baseURL = 'http://localhost:3333'

const BypassController = () => import('#controllers/bypass_controller')
router.get('/pets', [BypassController, 'index'])
router.post('/pet', [BypassController, 'create'])
