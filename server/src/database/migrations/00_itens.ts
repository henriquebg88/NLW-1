import Knex from 'knex';

export async function up(knex: Knex) {
    //Cria a tabela
    
    return knex.schema.createTable( 'itens', table => {
        table.increments('id').primary;
        table.string('image').notNullable();
        table.string('title').notNullable();;
    } );
}

export async function down(knex: Knex) {
    //Deleta a tabela

    return knex.schema.dropTable('itens');
}