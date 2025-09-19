import express from 'express';
import { getAllUserNames, checkUsername, createUser, checkEmail, verifyLogin } from '../controllers/users/usersControllers.js';
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
router.get('/login/:username', async (req, res) => {
    console.info('Verifying login');
    try {
        res.json(await verifyLogin(req.body.username, req.body.password));
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});
router.get('/:username', async (req, res) => {
    console.info('Checking username: ', req.params.username);
    try {
        const result = await checkUsername(req.params.username);
        res.json({ inUse: result });
    }
    catch (error) {
        console.error('Error in checkUsername route:', error);
        res.status(500).json({ error: 'Error checking username' });
    }
});
router.post('/', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const emailInUse = await checkEmail(email);
        if (emailInUse) {
            return res.status(409).json({ success: false, error: 'Email already in use' });
        }
        const newUser = await createUser(username, email, password);
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Error creating user" });
    }
});
export default router;
//# sourceMappingURL=usersRoutes.js.map