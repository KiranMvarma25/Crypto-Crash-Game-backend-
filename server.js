const express = require('express');
const dbConnect = require('./config/db');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

dbConnect();

const playersRouter = require('./routes/playerRoute');
app.use('/players', playersRouter);

const gameRouter = require('./routes/gameRoutes');
app.use('/game', gameRouter);

const walletRouter = require('./routes/walletRoutes');
app.use('/wallet', walletRouter);