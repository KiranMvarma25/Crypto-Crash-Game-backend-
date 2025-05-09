const crypto = require('crypto');

exports.generateSeed = () => {
  return crypto.randomBytes(16).toString('hex');
};

exports.calculateCrashPoint = (seed, roundNumber) => {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const crashPoint = (parseInt(hash.substring(0, 8), 16) % 10000) / 100;
  return Math.max(1.0, crashPoint);
};