const express = require('express');
const gameRouter = express.Router();
const gameController = require('../controllers/gameController');

gameRouter.post('/start', gameController.startNewRound);
gameRouter.post('/bet', gameController.placeBet);
gameRouter.post('/cashout', gameController.cashOut);

module.exports = gameRouter;