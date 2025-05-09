const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
    roundNumber: { 
        type: Number, 
        required: true 
    },
    startTime: { 
        type: Date, 
        default: Date.now 
    },
    crashPoint: { 
        type: Number 
    },
    multiplier: { 
        type: Number, 
        default: 1 
    },
    players: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Players' 
    }],
});

module.exports = mongoose.model('GameRounds', gameRoundSchema);