const helmet = require('helmet')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
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
};

module.exports = setupMiddlewares;