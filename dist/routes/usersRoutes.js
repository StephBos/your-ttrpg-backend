import express from 'express';
import { getAllUserNames } from '../controllers/usersControllers.js';
const router = express.Router();
router.get('/', async (req, res) => {
    console.log('Users route hit!');
    try {
        const userNames = await getAllUserNames();
        res.json(userNames);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=usersRoutes.js.map