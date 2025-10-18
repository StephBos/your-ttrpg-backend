import express from 'express'
import config from './config/config.js'
import setupMiddlewares from './middlewares/index.js'
import usersRoutes from './routes/usersRoutes.js'
import rulesetRoutes from './routes/rulesetRoutes.js'
import { testConnection } from './config/database.js'
const app = express()
const port = config.port
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Apply all middleware
setupMiddlewares(app)

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Register routes
app.use('/users', usersRoutes)
app.use('/rulesets', rulesetRoutes)

// Test database connection on startup
testConnection().then((connected: boolean) => {
    if (!connected) {
        console.warn('Failed to connect to database at startup. Continuing to run server; DB-backed routes may fail until DB is available.')
    }

    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
})
