import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nome').notNullable()
      table.string('raca').notNullable()
      table.integer('idade').notNullable()
      table.enum('status', ['available', 'pending', 'adopted']).defaultTo('available').notNullable()
      table.string('owner_name').nullable()
      table.string('owner_email').nullable()
      table.json('tags').nullable()
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
