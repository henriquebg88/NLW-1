import express, { response } from 'express';
import path from 'path';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.use('/files', express.static( path.resolve( __dirname, '..', 'uploads' )));


app.listen(3333, () => {
    console.log('> Servidor iniciado')
})