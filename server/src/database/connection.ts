import knex from 'knex';

const connection = knex(
    {
        client: 'sqlite3',
        connection:
        {
            filename: './database.sqlite'
        }
    }
);

export default connection;