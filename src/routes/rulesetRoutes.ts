import express from 'express'
import type { Request, Response } from 'express'
import multer from 'multer'
import type { MulterRequest } from '../types/multerRequest.js'
import {
   createRuleset,
   getRulesetsByUsername,
} from '../controllers/rulesets/rulesetsController.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const memStorage = multer.memoryStorage()
const upload = multer({ storage: memStorage })

router.get('/', (req: Request, res: Response) => {
   res.send('Ruleset routes are working')
})

router.get('/:username', async (req: Request, res: Response) => {
   console.info('Fetching rulesets for user: ', req.params.username)

   try {
      if (req.params.username) {
         const rulesets = await getRulesetsByUsername(req.params.username)
         console.log('Rulesets fetched: ', rulesets)
         res.status(200).json(rulesets)
      }
   } catch (error) {
      console.error('Error fetching rulesets:', error)
      res.status(500).json({ error: 'Error fetching rulesets' })
   }
})

// Create new ruleset
router.post('/', upload.single('backgroundImage'), async (req, res) => {
   const typedReq = req as MulterRequest

   console.info('Creating new ruleset:', typedReq.body)

   try {
      const { username, title, description, game, createdAt, url } =
         typedReq.body

      const filename = typedReq.file ? typedReq.file.originalname : null

      if (!username || !game || !title || !url) {
         return res.status(400).json({
            error: 'Username, game, url and title are required fields',
         })
      }

      const backgroundImageUrl = typedReq.file
         ? `http://localhost:3000/uploads/${filename}`
         : null

      const newRuleset = await createRuleset(
         username,
         title,
         backgroundImageUrl,
         description,
         game,
         createdAt,
         url
      )

      if (typedReq.file && newRuleset.valid && filename) {
         console.info('Saving uploaded background image file')
         const uploadDir = path.join(__dirname, '../../uploads')
         fs.writeFileSync(path.join(uploadDir, filename), typedReq.file.buffer)
      }

      res.status(201).json(newRuleset)
   } catch (error) {
      console.error('Error creating ruleset:', error)
      res.status(500).json({ error: 'Error creating ruleset' })
   }
})

export default router
