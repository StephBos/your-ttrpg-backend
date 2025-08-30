const express = require('express')
const config = require('./config/config')
const setupMiddlewares = require('./middlewares')
const usersRoutes = require('./routes/usersRoutes')
const { testConnection } = require('./config/database')
const app = express()
const port = config.port

// Apply all middleware
setupMiddlewares(app)

// Register routes
app.use('/users', usersRoutes)

// Test database connection on startup
testConnection().then((connected: boolean) => {
    if (!connected) {
        console.error('Failed to connect to database. Exiting...')
        process.exit(1)
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
