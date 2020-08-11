import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors()); //Define quais endereços externos terão acesso à aplicação (para acessar a API)
app.use(express.json()); //Permite o retorno de JSON pela resposta de acesso as rotas
app.use(routes);

app.use( '/uploads', express.static(path.resolve(__dirname, '..', 'uploads')) );

app.listen(3333, () => {
    console.log('>> SERVIDOR INICIADO');
})

/**     O Node entende somente Javascript.
 *      Ao executar a primeira vez Node server.ts, ele não reconhecerá. 
 *      precisa ser executado: 
 *      npm install ts-node -D
 *      npm install typescript -D
 *      npx tsc --init                        //para criar o arquivo de configuração do typescript
 *      npm install ts-node-dev -D            //para o servidor reiniciar automaticamente ao salvar algum arquivo
 * 
 *      npx ts-node-dev src/server.ts             //para rodar a aplicação enfim  
 */