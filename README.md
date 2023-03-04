# ticket-picker-vrf
Leverages Chainlink VRF to pick out a random minter from the Odiville Ticket OE mint.

# Setup
Clone repository and run `npm install .` and then `node pick-v2.js`
Tested with Node v18.8.0, but should work on a variety of node versions.

# VRF Txs (V2)

See VRF Transactions here:  
Contract:    https://etherscan.io/address/0x666184a1f8d765e32f44096dfa7123b95a386f5f#code  
Request:     https://etherscan.io/tx/0xfe705562f93148837b880cd775510a05657cb0b7b22e3808cfac28e55846c547  
Request ID:  `114951942876416233129430544993221211270786755602060138683836684111726051413485`  
Fulfillment: https://etherscan.io/tx/0x4c30ae1b62b0512811d12687d30823a021fcbf027804ceaf0125a23c3200c97b  
RandomWords: `106098343512841060548645561417747488969644420845476621722048940151232866577090`  
Result:      `380`  
Address:     `0x032261cB5868414D70251a4D609e196838551457`  

Also appears in `pick-v2.js`

# VRF Txs (V1)

See VRF Transactions here:  
Contract:    https://etherscan.io/address/0x666184a1f8d765e32f44096dfa7123b95a386f5f#code  
Request:     https://etherscan.io/tx/0x714c4c7da2307ef5d49e53b3fd00ded0758df1bbec7508ed2387b2d64bcbf690  
Request ID:  `111939608454353332321484787595413205052921743507664338911233945510310449234428`  
Fulfillment: https://etherscan.io/tx/0x55fc5f8de0dc32c68ef0825c5533f24c55191b9402441225d1ecbe2a9e9b046f  
RandomWords: `16446820374484646721167629732543921047206800920911921099674191475130322202628`  
Result:      `21178`  
Address:     `0x8D8DDd590DD0B8F34f2e29d4cFaa549fE79ad15d`  

Also appears in `pick-v1.js`
