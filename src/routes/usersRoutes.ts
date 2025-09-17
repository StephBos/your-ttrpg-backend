import express from 'express'
import type { Request, Response } from 'express'
import { getAllUserNames, checkUsername, createUser } from '../controllers/usersControllers.js'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    console.info('Getting all usernames')
    try {
        res.json(await getAllUserNames())
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})


router.get('/:username', async (req: Request, res: Response) => {        
    console.info('Checking username: ', req.params.username)
    try {
        const result = await checkUsername(req.params.username)
        res.json({inUse: result})
    } catch (error) {
        console.error('Error in checkUsername route:', error)
        res.status(500).json({error: 'Internal server error'})
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
  
      // validation example
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newUser = await createUser(username, email, password);
      return res.status(201).json(newUser)
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" })
    }
  })


export default router
