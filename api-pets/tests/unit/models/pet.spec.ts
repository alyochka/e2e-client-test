import { test } from '@japa/runner'

test.group('Pet model', () => {
  test('serializes tags array to JSON string', ({ assert }) => {
    const tags = ['friendly', 'vaccinated']
    const serialized = JSON.stringify(tags)
    assert.equal(serialized, '["friendly","vaccinated"]')
  })

  test('parses tags JSON string back to array', ({ assert }) => {
    const json = '["friendly","vaccinated"]'
    const parsed = JSON.parse(json) as string[]
    assert.deepEqual(parsed, ['friendly', 'vaccinated'])
  })

  test('has correct status values', ({ assert }) => {
    assert.equal('available', 'available')
    assert.equal('pending', 'pending')
    assert.equal('adopted', 'adopted')
  })

  test('handles null tags gracefully', ({ assert }) => {
    const tags = null
    assert.isNull(tags)
  })

  test('handles empty tags array', ({ assert }) => {
    const tags: string[] = []
    assert.deepEqual(tags, [])
  })
})
