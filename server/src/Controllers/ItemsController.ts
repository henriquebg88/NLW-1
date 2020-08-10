import { Request, Response } from 'express';
import knexConnection from '../database/connection';


class ItemsController {

    async index(req: Request, res: Response) {

        let listedItems = await knexConnection('Items').select('*');

        let serializedItems = listedItems.map(item => {
            return {
                title: item.title,
                URL: `http://localhost:3333/uploads/${item.image}.svg`
            };
        })

        return res.json(serializedItems);
    }

}

export default ItemsController;