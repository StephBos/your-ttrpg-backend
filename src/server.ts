const express = require('express')
const config = require('./config/config')
const port = config.port
const cors = require('cors')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())



try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
} catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
}
