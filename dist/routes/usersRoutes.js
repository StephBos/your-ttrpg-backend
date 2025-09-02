import express from 'express';
import { getAllUserNames, checkUsername } from '../controllers/usersControllers.js';
const router = express.Router();
router.get('/', async (req, res) => {
    console.info('Getting all usernames');
    try {
        res.json(await getAllUserNames());
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:username', async (req, res) => {
    try {
        const result = await checkUsername(req.params.username);
        res.json(result);
    }
    catch (error) {
        console.error('Error in checkUsername route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=usersRoutes.js.map