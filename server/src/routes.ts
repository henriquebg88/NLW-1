import express from 'express';
import PointsController from './Controllers/PointsController';
import ItemsController from './Controllers/ItemsController';

const router = express.Router();

const itemsController = new ItemsController();
const pointController = new PointsController();

router.get('/items', itemsController.index);

router.get('/points/:id', pointController.show);
router.get('/points', pointController.index);
router.post('/points', pointController.create);

router.get('/', (req, res) => {

    return res.json({ mensagem: 'Home' })
})



export default router;