import express from 'express';
import knexDB from './database/connection';

const router = express.Router();

/////////////////////////////////////////////////////////////

router.get("/itens", async (req, resp) => {

    const itens = await knexDB('itens').select('*');
    const serializedItens = itens.map( item => {
        return {
            title: item.title,
            image_url: `http://localhost:3333/itens/${item.image}`
        }
    })

    return resp.json(serializedItens);
})

/////////////////////////////////////////////////////////////

export default router; 