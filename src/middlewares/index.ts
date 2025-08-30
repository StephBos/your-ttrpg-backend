import helmet from 'helmet'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import type { Application } from 'express'


const setupMiddlewares = (app: Application) => {
    // Security middleware
    app.use(helmet());
    
    // CORS
    app.use(cors());
    
    // Request parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Logging
    app.use(morgan('combined'));
}

export default setupMiddlewares
