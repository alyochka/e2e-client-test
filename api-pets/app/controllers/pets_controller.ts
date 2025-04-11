import Pet from '#models/pet'
import { inserePetValidator } from '#validators/pet'
import { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'

export default class PetsController {
  constructor() {
    this.pets = [new Pet({ idade: 6, nome: 'Shibo', id: 0, raca: 'Pug' })]
  }

  @ApiOperation({ summary: 'Lista Pets' })
  @ApiResponse({ type: [Pet] })
  index({}: HttpContext): Pet[] {
    console.log('INDEX')
    return this.pets
  }

  @ApiOperation({ summary: 'Insere Pet' })
  @ApiResponse({ type: Pet })
  @ApiBody({ type: () => inserePetValidator })
  async create({ request }: HttpContext): Promise<Pet> {
    console.log('create')
    const data = request.all()
    const payload = await inserePetValidator.validate(data)

    const pet = new Pet(payload)
    this.pets.push(pet)

    return pet
  }

  private pets: Pet[]
}
