import { ApiProperty } from '@foadonis/openapi/decorators'

export class ErrorResponse {
  @ApiProperty({ type: String })
  declare message: string

  @ApiProperty({ type: String })
  declare code: string

  @ApiProperty({ type: Number })
  declare status: number
}

export class PaginatedResponse<T> {
  @ApiProperty()
  declare data: T[]

  @ApiProperty({ type: Object })
  declare meta: {
    page: number
    perPage: number
    total: number
  }
}
