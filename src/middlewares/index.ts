import helmet from 'helmet'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import type { Application } from 'express'

const setupMiddlewares = (app: Application) => {
   // Security middleware
   app.use(
      helmet({
         crossOriginResourcePolicy: { policy: 'cross-origin' },
      })
   )

   // CORS
   app.use(
      cors({
         origin: 'http://localhost:3001',
      })
   )

   // Request parsing
   app.use((req, res, next) => {
      if (req.is('multipart/form-data')) return next()
      express.json({ limit: '10mb' })(req, res, (err) => {
         if (err) return res.status(400).json({ error: 'Invalid JSON body' })
         express.urlencoded({ extended: true })(req, res, next)
      })
   })

   // Logging
   app.use(morgan('combined'))
}

export default setupMiddlewares
