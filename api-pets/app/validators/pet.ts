import vine from '@vinejs/vine'

/**
 * Valida inserção de pet
 */
export const inserePetValidator = vine.compile(
  vine.object({
    nome: vine.string().trim(),
    raca: vine.string().trim(),
    idade: vine.number().positive().withoutDecimals(),
    id: vine.number().positive().withoutDecimals(),
  })
)
