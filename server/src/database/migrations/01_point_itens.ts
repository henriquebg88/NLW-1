import Knex from 'knex';

export async function up(knex: Knex) {
    //Cria a tabela
    
    return knex.schema.createTable( 'point_itens', table => {
        table.increments('id').primary;

        //Chanve estrangeira
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        //chave estrangeira
        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('itens');

    } );
}

export async function down(knex: Knex) {
    //Deleta a tabela

    return knex.schema.dropTable('point_itens');
}