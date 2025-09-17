import express from 'express'
import config from './config/config.js'
import setupMiddlewares from './middlewares/index.js'
import usersRoutes from './routes/usersRoutes.js'
import { testConnection } from './config/database.js'
const app = express()
const port = config.port

// Apply all middleware
setupMiddlewares(app)

// Register routes
app.use('/users', usersRoutes)

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
