const Player = require('../model/player');
const Transaction = require('../model/transaction');
const cryptoService = require('../services/cryptoService');

exports.getBalance = async (req, res) => {
  const { email } = req.params;
  try{
    const player = await Player.findOne({ email });
    if(!player) 
        return res.status(404).json({ message: 'Player not found' });

    const cryptoPrice = await cryptoService.getCryptoPrice('bitcoin'); 
    const usdEquivalent = player.cryptoBalance * cryptoPrice;

    res.json({
      cryptoBalance: player.cryptoBalance,
      usdEquivalent,
    });
  } 
  catch(error){
    res.status(500).json({ message: 'Error fetching balance', error });
  }
};