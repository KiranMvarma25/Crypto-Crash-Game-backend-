const gameRoundSchema = require("../model/gameRound");
const playersSchema = require("../model/player");
const transactionSchema = require('../model/transaction');
const cryptoService = require('../services/cryptoService');
const gameService = require('../services/gameService');

exports.startNewRound = async(req, resp) => {
    try{
        const roundNumber = await gameService.generateRoundNumber();
        const crashPoint = gameService.calculateCrashPoint(roundNumber);

        const newRound = await gameRoundSchema.create({ roundNumber, crashPoint, players: [] });

        resp.status(200).json({
            success : true,
            message : "Created Round Successfully",
            rounds : newRound
        })
    }
    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

exports.placeBet = async (req, resp) => {
    try {
        const { email, betAmountUSD, cryptoType, roundNumber } = req.body;

        console.log("Place Bet Request:", req.body);

        const player = await playersSchema.findOne({ email });
        if (!player) {
            return resp.status(404).json({ success: false, message: "Player not found" });
        }

        const cryptoPrice = await cryptoService.getCryptoPrice(cryptoType);
        if (!cryptoPrice) {
            return resp.status(500).json({ success: false, message: "Error fetching crypto price" });
        }

        const cryptoAmount = betAmountUSD / cryptoPrice;
        console.log("Bet Amount USD:", betAmountUSD, "Crypto Price:", cryptoPrice, "Crypto Amount:", cryptoAmount);

        // Update player balances
        player.cryptoBalance -= cryptoAmount;
        player.usdBalance -= betAmountUSD;

        // Create the transaction record
        await transactionSchema.create({
            playerId: player._id,
            usdAmount: betAmountUSD,
            cryptoAmount: cryptoAmount,
            currency: cryptoType,
            transactionType: 'bet',
            transactionHash: gameService.generateTransactionHash(),
            priceAtTime: cryptoPrice,
        });

        // Find and update the game round
        const gameRound = await gameRoundSchema.findOne({ roundNumber });
        if (!gameRound) {
            return resp.status(404).json({ success: false, message: "Game round not found" });
        }

        gameRound.players.push(player._id);
        await gameRound.save();
        await player.save();

        resp.status(200).json({ success: true, message: "Bet placed successfully" });
    } catch (error) {
        console.error("Error in placing bet:", error);
        resp.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.cashOut = async(req, resp) => {
    try{
        const { email, roundNumber, cryptoType } = req.body;
        const player = await playersSchema.findOne({ email });
        const gameRound = await gameRoundSchema.findOne({ roundNumber });

        const multiplier = gameRound.crashPoint; // Using crashPoint as final multiplier
        const cryptoPayout = player.cryptoBalance * multiplier;
        const cryptoPrice = await cryptoService.getCryptoPrice('bitcoin');
        const usdPayout = cryptoPayout * cryptoPrice;

        player.cryptoBalance += cryptoPayout;
        player.usdBalance += usdPayout;

        await transactionSchema.create({
            playerId: player._id,
            usdAmount: usdPayout,
            cryptoAmount: cryptoPayout,
            currency: 'btc',
            transactionType: 'cashout',
            transactionHash: gameService.generateTransactionHash(),
            priceAtTime: cryptoPrice,
        });

        await player.save();

        resp.status(200).json({ message: 'Cashout successful' });
    }
    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}