import express from 'express'
import type { Request, Response } from 'express'
import multer from 'multer'
import type {MulterRequest} from '../types/multerRequest.js'
import { createRuleset } from '../controllers/rulesets/rulesetsController.js'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // where files are saved
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) // keep original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

router.get('/', (req: Request, res: Response) => {
  res.send('Ruleset routes are working')
})

// Create new ruleset
router.post('/', upload.single('backgroundImage'), async (req, res) => {
  const typedReq = req as MulterRequest

  console.info('Creating new ruleset:', typedReq.body)

  try {
    const { username, title, description, game, createdAt } = typedReq.body
    const backgroundImageUrl = typedReq.file
      ? `http://localhost:3000/uploads/${typedReq.file.filename}`
      : null

    if (!username || !game || !title) {
      return res
        .status(400)
        .json({ error: 'Username, game, and title are required fields' })
    }
    console.log('username:', username)
    const newRuleset = await createRuleset(
      username,
      title,
      backgroundImageUrl,
      description,
      game,
      createdAt
    )

    res.status(201).json(newRuleset)
  } catch (error) {
    console.error('Error creating ruleset:', error)
    res.status(500).json({ error: 'Error creating ruleset' })
  }
})

export default router
