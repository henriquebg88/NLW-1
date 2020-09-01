import { Request, Response } from 'express';
import knexConnection from '../database/connection';


class ItemsController {

    async index(req: Request, res: Response) {

        let listedItems = await knexConnection('Items').select('*');

        let serializedItems = listedItems.map(item => {
            return {
                id: item.id,
                title: item.title,
                URL: `http://localhost:3333/uploads/${item.image}`
            };
        })

        return res.json(serializedItems);
    }

}

export default ItemsController;