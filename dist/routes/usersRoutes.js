import express from 'express';
import { getAllUserNames, checkUsernameOrEmail, createUser, checkEmail, verifyLogin, resetPasswordRequest } from '../controllers/users/usersControllers.js';
const router = express.Router();
router.get('/', async (req, res) => {
    console.info('Getting all usernames');
    try {
        res.json(await getAllUserNames());
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting all usernames' });
    }
});
router.get('/:username', async (req, res) => {
    console.info('Checking username: ', req.params.username);
    try {
        const result = await checkUsernameOrEmail(req.params.username ?? '');
        res.json({ inUse: result ? true : false });
    }
    catch (error) {
        console.error('Error in checkUsername route:', error);
        res.status(500).json({ error: 'Error checking username' });
    }
});
router.post('/login', async (req, res) => {
    console.info('Verifying login');
    try {
        return res
            .status(201)
            .json(await verifyLogin(req.body.usernameOrEmail, req.body.password));
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});
router.post('/resetRequest', async (req, res) => {
    console.info('Resetting password');
    try {
        return res
            .status(201)
            .json(await resetPasswordRequest(req.body.usernameOrEmail));
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting reset password link' });
    }
});
router.post('/', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const emailInUse = await checkEmail(email);
        if (emailInUse) {
            return res
                .status(409)
                .json({ success: false, error: 'Email already in use' });
        }
        const newUser = await createUser(username, email, password);
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Error creating user' });
    }
});
export default router;
//# sourceMappingURL=usersRoutes.js.map