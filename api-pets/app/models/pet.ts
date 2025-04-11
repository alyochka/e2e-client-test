import { ApiProperty } from '@foadonis/openapi/decorators'

export default class Pet {
  constructor({
    id,
    nome,
    raca,
    idade,
  }: {
    id: number
    nome: string
    raca: string
    idade: number
  }) {
    this.id = id
    this.nome = nome
    this.raca = raca
    this.idade = idade
  }

  @ApiProperty()
  declare id: number

  @ApiProperty()
  declare nome: string

  @ApiProperty()
  declare raca: string

  @ApiProperty()
  declare idade: number
}
