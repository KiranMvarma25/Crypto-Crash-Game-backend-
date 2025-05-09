const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 10 });

exports.getCryptoPrice = async (cryptoType) => {
  const cachedPrice = cache.get(cryptoType);
  if(cachedPrice){
    console.log("Returning cached price for", cryptoType, cachedPrice);
    return cachedPrice;
  }

  try{
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoType}&vs_currencies=usd`
    );

    if(!response.data[cryptoType]){
      console.error(`No price data found for ${cryptoType}`);
      throw new Error('Crypto type not found');
    }

    const price = response.data[cryptoType].usd;
    cache.set(cryptoType, price);
    console.log("Fetched new price for", cryptoType, price);
    return price;
  } 
  catch(error){
    console.error("Error fetching crypto price:", error.message);
    throw new Error('Error fetching crypto price');
  }
};