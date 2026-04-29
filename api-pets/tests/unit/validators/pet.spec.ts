import { test } from '@japa/runner'
import { inserePetValidator } from '#validators/pet'

test.group('Pet validator', () => {
  test('validates correct pet data', async ({ assert }) => {
    const data = {
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
    }

    const result = await inserePetValidator.validate(data)
    assert.equal(result.nome, 'Shibo')
    assert.equal(result.raca, 'Pug')
    assert.equal(result.idade, 6)
  })

  test('accepts optional status field', async ({ assert }) => {
    const data = {
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
      status: 'available',
    }

    const result = await inserePetValidator.validate(data)
    assert.equal(result.status, 'available')
  })

  test('accepts optional owner fields', async ({ assert }) => {
    const data = {
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
      ownerName: 'John',
      ownerEmail: 'john@example.com',
    }

    const result = await inserePetValidator.validate(data)
    assert.equal(result.ownerName, 'John')
    assert.equal(result.ownerEmail, 'john@example.com')
  })

  test('accepts optional tags array', async ({ assert }) => {
    const data = {
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
      tags: ['friendly', 'vaccinated'],
    }

    const result = await inserePetValidator.validate(data)
    assert.deepEqual(result.tags, ['friendly', 'vaccinated'])
  })

  test('accepts optional notes', async ({ assert }) => {
    const data = {
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
      notes: 'Needs grooming',
    }

    const result = await inserePetValidator.validate(data)
    assert.equal(result.notes, 'Needs grooming')
  })

  test('rejects missing nome', async ({ assert }) => {
    const data = { raca: 'Pug', idade: 6 }

    try {
      await inserePetValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'nome')
    }
  })

  test('rejects missing raca', async ({ assert }) => {
    const data = { nome: 'Shibo', idade: 6 }

    try {
      await inserePetValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'raca')
    }
  })

  test('rejects missing idade', async ({ assert }) => {
    const data = { nome: 'Shibo', raca: 'Pug' }

    try {
      await inserePetValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'idade')
    }
  })

  test('rejects decimal idade', async ({ assert }) => {
    const data = { nome: 'Shibo', raca: 'Pug', idade: 6.5 }

    try {
      await inserePetValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'idade')
    }
  })

  test('rejects negative idade', async ({ assert }) => {
    const data = { nome: 'Shibo', raca: 'Pug', idade: -1 }

    try {
      await inserePetValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'idade')
    }
  })

  test('rejects invalid ownerEmail format', async ({ assert }) => {
    const data = {
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
      ownerEmail: 'not-an-email',
    }

    try {
      await inserePetValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'ownerEmail')
    }
  })
})
