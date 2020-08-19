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

export default router;