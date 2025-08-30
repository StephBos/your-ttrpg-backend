const express = require('express')
import type { Request, Response } from 'express'
const { getAllUserNames } = require('../controllers/usersControllers')

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    console.log('Users route hit!')
    try {
        const userNames = await getAllUserNames()
        res.json(userNames)
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})

module.exports = router
