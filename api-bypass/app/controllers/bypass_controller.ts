import { HttpContext } from '@adonisjs/core/http'
import { getPets } from '#client/generated/pets'
import { postPet, InserePetValidator } from '#client/generated/pets'

export default class BypassController {
  async index({ request }: HttpContext) {
    const params = request.qs()
    const authHeader = request.header('authorization')
    const response = await getPets({
      params,
      headers: authHeader ? { authorization: authHeader } : {},
    })
    return response.data
  }

  async create({ request }: HttpContext) {
    const data = request.only(['nome', 'raca', 'idade', 'status', 'ownerName', 'ownerEmail', 'tags', 'notes'])
    const authHeader = request.header('authorization')
    const response = await postPet(data as InserePetValidator, {
      headers: authHeader ? { authorization: authHeader } : {},
    })
    return response.data
  }
}
