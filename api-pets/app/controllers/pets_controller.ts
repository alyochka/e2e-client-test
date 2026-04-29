import Pet from '#models/pet'
import { inserePetValidator } from '#validators/pet'
import { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { ErrorResponse, PaginatedResponse } from '#models/error_response'

export default class PetsController {
  @ApiOperation({ summary: 'List all pets with pagination' })
  @ApiResponse({ type: Pet })
  @ApiResponse({ status: 400, type: ErrorResponse })
  async index({ request }: HttpContext): Promise<PaginatedResponse<Pet>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const result = await Pet.query().paginate(page, perPage)

    return {
      data: result.all(),
      meta: {
        page: result.currentPage,
        perPage: result.perPage,
        total: result.total,
      },
    }
  }

  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ type: Pet })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 401, type: ErrorResponse })
  @ApiBody({ type: () => inserePetValidator })
  async create({ request }: HttpContext): Promise<Pet> {
    const data = request.only(['nome', 'raca', 'idade', 'status', 'ownerName', 'ownerEmail', 'tags', 'notes'])
    const payload = await inserePetValidator.validate(data)

    const pet = await Pet.create(payload)
    return pet
  }
}
