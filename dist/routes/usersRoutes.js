import express from 'express';
import { getAllUserNames, checkUsername, createUser } from '../controllers/usersControllers.js';
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
    console.info('checking username: ', req.params.username);
    try {
        const result = await checkUsername(req.params.username);
        res.json({ available: result });
    }
    catch (error) {
        console.error('Error in checkUsername route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newUser = await createUser(username, email, password);
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=usersRoutes.js.map