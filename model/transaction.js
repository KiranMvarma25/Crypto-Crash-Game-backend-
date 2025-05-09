const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Players' 
  },
  usdAmount: { 
    type: Number 
  },
  cryptoAmount: { 
    type: Number 
  },
  currency: { 
    type: String 
  },
  transactionType: { 
    type: String, 
    enum: ['bet', 'cashout'] 
  },
  transactionHash: { 
    type: String 
  },
  priceAtTime: { 
    type: Number 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Transactions', transactionSchema);