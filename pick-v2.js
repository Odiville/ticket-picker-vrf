import keccak256 from "keccak256";

import * as holders from "./holders.json" assert { type: "json" };

const addresses = holders.default;

// See VRF Transactions here:
// Contract:    https://etherscan.io/address/0x666184a1f8d765e32f44096dfa7123b95a386f5f#code
// Request:     https://etherscan.io/tx/0xfe705562f93148837b880cd775510a05657cb0b7b22e3808cfac28e55846c547
// Request ID:  114951942876416233129430544993221211270786755602060138683836684111726051413485
// Fulfillment: https://etherscan.io/tx/0x4c30ae1b62b0512811d12687d30823a021fcbf027804ceaf0125a23c3200c97b
// RandomWords: 106098343512841060548645561417747488969644420845476621722048940151232866577090
// Result:      380
const vrfRandomWords = 106098343512841060548645561417747488969644420845476621722048940151232866577090n;
const vrfResult = 380n;

function pickWinner() {
  const addressesLength = BigInt(`${addresses.length}`);
  const checkVRFResult = vrfRandomWords % addressesLength;
  if (checkVRFResult !== vrfResult) {
    console.error("VRF Result does not match!");
    console.error(`VRF Result: ${vrfResult}`);
    console.error(`VRF Check: ${checkVRFResult}`);
    return;
  }

  addresses.sort(); // Sort for consistency

  const addressesHash = keccak256(addresses).toString("hex");
  console.log(`Addresses Hashed: 0x${addressesHash}`);
  console.log(`Addresses Length: ${addressesLength}`);

  const winner = addresses[vrfResult];
  console.log("VRF Random Words: " + vrfRandomWords);
  console.log(`VRF Result: ${vrfResult} / ${addressesLength}`);
  console.log("VRF Picked Winner: " + winner);
}

pickWinner();