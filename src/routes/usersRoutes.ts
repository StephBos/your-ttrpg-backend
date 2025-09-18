import express from 'express'
import type { Request, Response } from 'express'
import { getAllUserNames, checkUsername, createUser, checkEmail } from '../controllers/usersControllers.js'

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
      let { username, email, password } = req.body
      username = username.trim().toLowerCase()
      email = email.trim().toLowerCase()
  
      // Make sure all variables are present
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" })
      }

      //Check if email is already in use
      const emailInUse = await checkEmail(email)
      if(emailInUse){
        console.log('gonna send a 409')
        return res.status(409).json({ success: false, error: "Email already in use" })
      }

      //Normalizing username and email in the pass
      const newUser = await createUser(username, email, password)
      return res.status(201).json(newUser)
    } catch (error) {
      console.error("Error creating user:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  })


export default router
