import Knex from 'knex';

export async function up(knex: Knex) {
    return await knex.schema.createTable('Point_Items', table => {
        table.increments('id').primary();

        table.integer('Point_id').notNullable()
            .references('id').inTable('Points');

        table.integer('Item_id').notNullable()
            .references('id').inTable('Items');
    })
}
export async function down(knex: Knex) {
    return await knex.schema.dropTable('Point_Items');
} //Necessaria caso haja algum erro -> Rollback