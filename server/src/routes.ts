import express from 'express';

const router = express.Router();

/////////////////////////////////////////////////////////////

router.get("/", (req, resp) => {

    return resp.json(
        [
            'Mlk doido',
            'Linga de trapo',
            'Sapo colorado',
            'Morte ao Paulo, lenta e dolorosa'
        ]
    )
})

/////////////////////////////////////////////////////////////

export default router; 