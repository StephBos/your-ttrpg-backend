import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
const setupMiddlewares = (app) => {
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('combined'));
};
export default setupMiddlewares;
//# sourceMappingURL=index.js.map