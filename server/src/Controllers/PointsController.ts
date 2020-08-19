import knexConnection from '../database/connection';
import { Request, Response } from 'express';


class PointsController {

    async create(req: Request, res: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        const trx = await knexConnection.transaction();

        const point_ids = await trx('Points').insert({
            name,
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        })

        const pointItems = items.map( (item_id: number) => {
            return {
                item_id,
                point_id: point_ids[0]
            }
        } )

        await trx('Point_Items').insert(pointItems)

        trx.commit();

        const point = {
            id: point_ids[0],
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        }

        return res.json( point )
    }

    async index(req: Request, res: Response) {

        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()) );

        const points = await knexConnection('Points')
            .join('Point_Items', 'Points.id', '=', 'Point_Items.point_id')
            .whereIn('Point_Items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('Points.*')

        return res.json(points)
    }

    async show(req: Request, res: Response) {
        let { id } = req.params;

        let point = await knexConnection('Points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: `Nada encontrado no ID ${id}` });
        }

        let items = await knexConnection('Items')
            .join('Point_Items', 'Items.id', '=', 'Point_Items.item_id')
            .where('Point_Items.point_id', id)
            .select('title')

        return res.json({ point, items });

    }
}

export default PointsController;
