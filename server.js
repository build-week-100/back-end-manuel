const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authentication-middleware.js');
const authRouter = require('../auth/auth-router.js');
const marketRouter = require('../market/market-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/market', authenticate, marketRouter);

module.exports = server;