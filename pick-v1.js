import fs from "fs";
import keccak256 from "keccak256";
import { ethers } from "ethers"; // note: ethers v6
import { parse } from "csv-parse";

let counter = 0;
const addresses = [];
const parser = parse({
  delimiter: ",",
});
parser.on("readable", function () {
  let record;
  while ((record = parser.read()) !== null) {
    try {
      counter++;
      let address = record[0].toLowerCase();
      let amount = Number(record[1]);
      address = ethers.getAddress(address);
      for (let i = 0; i < amount; i++) {
        // Each address gets entries equal to the amount they bought
        addresses.push(address);
      }
    } catch (e) {
      console.error(`Could not parse input: ${record} (Entry ${counter})`);
      console.error(e);
    }
  }
});
parser.on("error", function (err) {
  console.error(err.message);
});

const stream = fs.createReadStream("./mint_snapshot.csv");
parser.on("end", () => {
  pickWinner();
});
stream.pipe(parser);

// See VRF Transactions here:
// Contract:    https://etherscan.io/address/0x666184a1f8d765e32f44096dfa7123b95a386f5f#code
// Request:     https://etherscan.io/tx/0x714c4c7da2307ef5d49e53b3fd00ded0758df1bbec7508ed2387b2d64bcbf690
// Request ID:  111939608454353332321484787595413205052921743507664338911233945510310449234428
// Fulfillment: https://etherscan.io/tx/0x55fc5f8de0dc32c68ef0825c5533f24c55191b9402441225d1ecbe2a9e9b046f
// RandomWords: 16446820374484646721167629732543921047206800920911921099674191475130322202628
// Result:      21178
const vrfRandomWords = 16446820374484646721167629732543921047206800920911921099674191475130322202628n;
const vrfResult = 21178n;

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
