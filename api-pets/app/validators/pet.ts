import vine from '@vinejs/vine'

export const inserePetValidator = vine.compile(
  vine.object({
    nome: vine.string().trim(),
    raca: vine.string().trim(),
    idade: vine.number().positive().withoutDecimals(),
    status: vine.enum(['available', 'pending', 'adopted']).optional(),
    ownerName: vine.string().trim().optional(),
    ownerEmail: vine.string().email().optional(),
    tags: vine.array(vine.string()).optional(),
    notes: vine.string().optional(),
  })
)
