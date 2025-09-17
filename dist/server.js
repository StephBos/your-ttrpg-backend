import express from 'express';
import config from './config/config.js';
import setupMiddlewares from './middlewares/index.js';
import usersRoutes from './routes/usersRoutes.js';
import { testConnection } from './config/database.js';
const app = express();
const port = config.port;
setupMiddlewares(app);
app.use('/users', usersRoutes);
testConnection().then((connected) => {
    if (!connected) {
        console.warn('Failed to connect to database at startup. Continuing to run server; DB-backed routes may fail until DB is available.');
    }
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=server.js.map