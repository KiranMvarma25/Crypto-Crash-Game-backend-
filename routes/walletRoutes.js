const express = require('express');
const walletRouter = express.Router();
const walletController = require('../controllers/walletController');

walletRouter.get('/balance/:email', walletController.getBalance);

module.exports = walletRouter;