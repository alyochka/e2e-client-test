import { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@foadonis/openapi/decorators'
import User from '#models/user'
import Session from '#models/session'
import crypto from 'node:crypto'
import { ErrorResponse } from '#models/error_response'

class LoginUserResponse {
  @ApiProperty({ type: Number })
  declare id: number

  @ApiProperty({ type: String })
  declare email: string

  @ApiProperty({ type: String })
  declare fullName: string | null
}

class LoginResponse {
  @ApiProperty({ type: String })
  declare token: string

  @ApiProperty({ type: () => LoginUserResponse })
  declare user: { id: number; email: string; fullName: string | null }
}

export default class AuthController {
  @ApiOperation({ summary: 'Login and get Bearer token' })
  @ApiResponse({ type: LoginResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiBody({ type: () => loginValidator })
  async login({ request }: HttpContext): Promise<LoginResponse> {
    const data = request.only(['email', 'password'])
    const payload = await loginValidator.validate(data)

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)

      const token = crypto.randomBytes(32).toString('hex')

      await Session.create({
        userId: user.id,
        token,
        name: 'api-session',
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      }
    } catch {
      const error = new Error('Invalid user credentials')
      ;(error as any).status = 401
      ;(error as any).code = 'E_UNAUTHORIZED_ACCESS'
      throw error
    }
  }
}
