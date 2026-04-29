import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Session from '#models/session'
import User from '#models/user'

export default class BearerAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.response.status(401).json({
        message: 'Missing or invalid authorization header',
        code: 'UNAUTHORIZED',
        status: 401,
      })
      return
    }

    const token = authHeader.slice(7)
    const session = await Session.query().where('token', token).first()

    if (!session) {
      ctx.response.status(401).json({
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED',
        status: 401,
      })
      return
    }

    const user = await User.find(session.userId)
    if (!user) {
      ctx.response.status(401).json({
        message: 'User not found',
        code: 'UNAUTHORIZED',
        status: 401,
      })
      return
    }

    Object.defineProperty(ctx.auth, 'user', { value: user, writable: true })
    return next()
  }
}
