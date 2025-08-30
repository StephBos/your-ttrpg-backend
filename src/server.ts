const express = require('express')
const config = require('./config/config')
const setupMiddlewares = require('./middlewares')
const app = express()
const port = config.port

// Apply all middleware
setupMiddlewares(app)



try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
} catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
}
