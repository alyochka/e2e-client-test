import { ApiProperty, ApiPropertyOptional } from '@foadonis/openapi/decorators'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  @ApiProperty({ type: Number })
  declare id: number

  @column()
  @ApiProperty({ type: String })
  declare nome: string

  @column()
  @ApiProperty({ type: String })
  declare raca: string

  @column()
  @ApiProperty({ type: Number })
  declare idade: number

  @column()
  @ApiProperty({ type: String })
  declare status: string

  @column()
  @ApiPropertyOptional({ type: String })
  declare ownerName: string | null

  @column()
  @ApiPropertyOptional({ type: String })
  declare ownerEmail: string | null

  @column({
    consume: (value: string | null) => (value ? (JSON.parse(value) as string[]) : null),
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
  })
  @ApiPropertyOptional({ type: [String] })
  declare tags: string[] | null

  @column()
  @ApiPropertyOptional({ type: String })
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  @ApiProperty({ schema: { type: 'string', format: 'date-time' } })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiPropertyOptional({ schema: { type: 'string', format: 'date-time' } })
  declare updatedAt: DateTime | null

  static get table() {
    return 'pets'
  }
}
