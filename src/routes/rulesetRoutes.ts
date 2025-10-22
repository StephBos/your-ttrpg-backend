import express from 'express'
import type { Request, Response } from 'express'
import multer from 'multer'
import type {MulterRequest} from '../types/multerRequest.js'
import { createRuleset } from '../controllers/rulesets/rulesetsController.js'
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

// Create new ruleset
router.post('/', upload.single('backgroundImage'), async (req, res) => {
  const typedReq = req as MulterRequest

  console.info('Creating new ruleset:', typedReq.body)

  try {
    const { username, title, description, game, createdAt, url } = typedReq.body

    const filename = typedReq.file ? typedReq.file.originalname : null

    if (!username || !game || !title || !url) {
      return res
        .status(400)
        .json({ error: 'Username, game, url and title are required fields' })
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
