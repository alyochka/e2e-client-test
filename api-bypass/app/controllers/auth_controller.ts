import { HttpContext } from '@adonisjs/core/http'
import { postAuthLogin } from '#client/generated/auth'

export default class AuthController {
  async login({ request }: HttpContext) {
    const data = request.only(['email', 'password'])
    const result = await postAuthLogin(data)
    return result.data
  }
}
