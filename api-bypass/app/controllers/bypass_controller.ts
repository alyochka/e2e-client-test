import { HttpContext } from '@adonisjs/core/http'
import { getPets, Pet } from '../client/petstore.js'

export default class BypassController {
  async index({}: HttpContext): Promise<Pet[]> {
    const response = await getPets()
    return response.data
  }
}
