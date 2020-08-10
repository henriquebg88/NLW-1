import knexConnection from '../database/connection';
import { Request, Response } from 'express';


class PointsController {

    async create(req: Request, res: Response) {

        let newPoint = req.body;
        let trx = await knexConnection.transaction();   //Garante que se alguma das operações falhar, todo o processo é abortado.

        let newPointId = await trx('Points').insert([
            {
                name: newPoint.name,
                image: '#',
                email: newPoint.email,
                whatsapp: newPoint.whatsapp,
                latitude: newPoint.latitude,
                longitude: newPoint.longitude,
                city: newPoint.city,
                uf: newPoint.uf,
            }
        ])


        let newPoint_Item = newPoint.items.map((item: Number) => {
            return {
                Point_id: newPointId[0],
                Item_id: item
            }
        })
        await trx('Point_Items').insert(newPoint_Item)

        trx.commit();

        return res.json({
            id: newPointId[0],
            ...newPoint,
        });
    };

    async index(req: Request, res: Response) {

        let {city, uf, items} = req.query;

        let parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()));

        let points = await knexConnection('Points')
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

        if(!point){
            return res.status(400).json({ message: `Nada encontrado no ID ${id}` });
        }

        let items = await knexConnection('Items')
            .join('Point_Items', 'Items.id', '=', 'Point_Items.item_id')
            .where('Point_Items.point_id', id)
            .select('title')

        return res.json({point, items});

    }
}

export default PointsController;
