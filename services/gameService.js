const crypto = require('crypto');

exports.generateRoundNumber = async () => {
  return Date.now(); 
};

exports.calculateCrashPoint = (roundNumber) => {
  const seed = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const crashPoint = (parseInt(hash.substring(0, 8), 16) % 10000) / 100;
  return Math.max(1.0, crashPoint);
};

exports.generateTransactionHash = () => {
  const transactionData = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(transactionData).digest('hex');
  return hash;
};