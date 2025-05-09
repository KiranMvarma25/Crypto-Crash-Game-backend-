Crypto Crash Game – Backend

This is the backend of a multiplayer Crypto Crash Game. Players place bets in USD, which are converted to cryptocurrencies based on real-time prices. The game simulates a "crash" point where players must cash out before the multiplier crashes.


Setup Instructions:

1. Clone the Repository - git clone https://github.com/your-username/crypto-crash-game-backend.git
    cd crypto-crash-game

2. Install Dependencies - npm install

3. Configure Environment Variables -

    Create a .env file in the root directory with the following
    PORT=your_number
    URL=your_mongodb_connection_string
    Secret_Key=your_secret_key
    
    No API key is required for the current implementation of the crypto price service using the CoinGecko API.

4. Start the Server - npm start
    
    The server will start on http://localhost:3007.





API Endpoints:


1. POST /players/register - Registers a new player.

Request:

json -
{
  "email": "ben@gmail.com",
  "username": "Ben"
}

Response:

json -
{
  "success": true,
  "player": { ... }
}



2. POST /game/start - Starts a new game round.

Response:

json -
{
  "success": true,
  "rounds": {
    "roundNumber": 1746772549095,
    "crashPoint": 2.78,
    ...
  }
}



3. POST /game/bet - Place a bet for a specific round.

Request:

json -
{
  "email": "ben@gmail.com",
  "betAmountUSD": 100,
  "cryptoType": "bitcoin",
  "roundNumber": 1746772549095
}

Response:

json -
{
  "success": true,
  "message": "Bet placed successfully"
}




4. POST /game/cashout - Cash out the player's bet at the current multiplier.

Request:

json -
{
  "email": "ben@gmail.com",
  "roundNumber": 1746772549095,
  "cryptoType": "bitcoin"
}
Response:

json -
{
  "message": "Cashout successful"
}



For Users:

http://localhost:3007/players/createUsers
http://localhost:3007/players/userLogin

{
    "name" : "sam",
    "email" : "sam@gmail.com",
    "password" : "123"
}

For Game:

http://localhost:3007/game/start
http://localhost:3007/game/bet
http://localhost:3007/game/cashout

{
    "email" : "sam@gmail.com",
    "betAmountUSD" : 50000,
    "cryptoType" : "bitcoin",
    "roundNumber": 1746793950709
}


For Wallet:

http://localhost:3007/wallet/balance/sam@gmail.com



USD to Crypto Conversion Logic:
1. Real-time prices are fetched from the CoinGecko API using the /simple/price endpoint.

2. Prices are cached for 10 seconds using node-cache to reduce redundant API calls.

3. USD amount is divided by the fetched crypto price to determine the crypto amount:



const cryptoAmount = betAmountUSD / currentPrice - Provably Fair Crash Algorithm
The game uses a deterministic algorithm to calculate the crash point using a combination of a server-generated seed and the round number:

const seed = crypto.randomBytes(16).toString('hex');
const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
const crashPoint = (parseInt(hash.substring(0, 8), 16) % 10000) / 100;
This ensures transparency and fairness as the crash point can be verified by hashing the known seed and round number.

The crash point is always at least 1.0x.




Game Logic Summary:

1. Start Round: A round is started by generating a unique round number and calculating the crash point.

2. Betting Phase: Players place bets in USD; the system converts the amount into crypto using real-time prices.

3. Cash Out: Players may cash out before the crash to multiply their crypto. The multiplier is the crash point.

4. Crash: The round ends at a specific crash point, and players who did not cash out lose their crypto.








Tech Stack:

1. Node.js with Express

2. MongoDB with Mongoose

3. Axios for API requests

4. Node-cache for temporary price caching

5. Crypto module for secure hash generation








Data from Mongoose Atlas (MongoDB) Database

Players - 

Query Results: 1-2 of 2

_id
681da1f65cc6da772c2ce786
name
"ben"
password
"$2b$10$JzfCGuterhfMn85iUz1DPeGbUMNKFqmL8EPt2GJoBAv.wpxEEXVoa"
email
"ben@gmail.com"
cryptoBalance
-18.960630532691415
usdBalance
-1955070.2185898433
__v
0
_id
681df4d3c2cc7b564370541b
name
"sam"
password
"$2b$10$bASUPHfFRSPlnXRrwE54deDlR87I7AKmJYCqOsZubpZwBxV.2f/xq"
email
"sam@gmail.com"
cryptoBalance
-20.118957520715682
usdBalance
-2073499.9999999998
__v
0


Game Rounds -

Query Results: 1-2 of 2
_id
681da2455cc6da772c2ce789
roundNumber
1746772549095
crashPoint
96.67
multiplier
1

players
Array (2)
startTime
2025-05-09T06:35:49.098+00:00
__v
2
_id
681df5dec2cc7b564370541e
roundNumber
1746793950709
crashPoint
40.47
multiplier
1

players
Array (1)
startTime
2025-05-09T12:32:30.713+00:00
__v
1


Transactions -

Query Results: 1-4 of 4
_id
681da587089f3a3fa526883c
playerId
681da1f65cc6da772c2ce786
usdAmount
10000
cryptoAmount
0.09706476160894549
currency
"bitcoin"
transactionType
"bet"
transactionHash
"ea3ee82ff9802dae0a6c9321d2f5b2958dfdd905afdc8b99dbb00fd06e916bfe"
priceAtTime
103024
timestamp
2025-05-09T06:49:43.281+00:00
__v
0
_id
681da6554ca06a680319e2e0
playerId
681da1f65cc6da772c2ce786
usdAmount
-1935070.2185898433
cryptoAmount
-18.766501009473522
currency
"btc"
transactionType
"cashout"
transactionHash
"fc46619659120f737b68da272d973f1e2411306f6b61cc8fbe73d3fb947d5af6"
priceAtTime
103113
timestamp
2025-05-09T06:53:09.971+00:00
__v
0
_id
681df664c2cc7b5643705421
playerId
681df4d3c2cc7b564370541b
usdAmount
50000
cryptoAmount
0.48514486425646697
currency
"bitcoin"
transactionType
"bet"
transactionHash
"18aef183a5ece0511c752e3a4247911949e6925c8fe6f776c5995c080d31edec"
priceAtTime
103062
timestamp
2025-05-09T12:34:44.121+00:00
__v
0
_id
681df66bc2cc7b5643705428
playerId
681df4d3c2cc7b564370541b
usdAmount
-2023499.9999999998
cryptoAmount
-19.633812656459217
currency
"btc"
transactionType
"cashout"
transactionHash
"18b0abd133fc2608823e8d2e041d28d8c5e8be5a8c39c515732eef307b2dc214"
priceAtTime
103062
timestamp
2025-05-09T12:34:51.819+00:00
__v
0