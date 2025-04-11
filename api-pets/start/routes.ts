/*
*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

const PetsController = () => import('#controllers/pets_controller')
router.get('/pets', [PetsController, 'index'])
router.post('/pet', [PetsController, 'create'])

openapi.registerRoutes()
router.get('/docs', () => openapi.generateUi('/api'))
