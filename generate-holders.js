import { ethers } from "ethers"; // note: ethers v6
import * as dotenv from "dotenv";
dotenv.config();
import * as erc1155Abi from "./erc1155_abi.json" assert { type: "json" };
import * as fs from 'fs';

const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_URL);
const blockStart = 16605755;
const blockEnd = 16744700;

const ticketAddress = "0x1386f70a946cf9f06e32190cfb2f4f4f18365b87";
const tokenIds = [2n, 3n, 4n, 5n, 6n];
const excludedAddresses = [
  "0x0000000000000000000000000000000000000000", // Null address
  "0x000000000000000000000000000000000000dead", // Burn address
  "0x504ca8a96c4f5134b288804e8270f1528bc5fc1c", // Game Master
  "0x0c54a765c77a88d9cda0bd7ad9b10422848d92ef", // Odious Vault
  "0xb21b7d5b3f348930ec6aa2d4135217bb6d08e860"  // Odious
];

const amountMap = new Map();

async function main() {
  const ticketContract = new ethers.Contract(
    ticketAddress,
    erc1155Abi.default,
    provider
  );

  // A scan of the log history showed that there hasn't been any TransferBatch events,
  // so skipping scanning that.
  const filter = ticketContract.filters.TransferSingle();

  const logs = [];

  for (let block = blockStart; block <= blockEnd; block += 2000) {
    const toBlock = Math.min(block + 1999, blockEnd);
    const blockLogs = await ticketContract.queryFilter(
      filter,
      block,
      toBlock,
    );
    logs.push(...blockLogs);
    console.log(`Scanned blocks ${block} to ${toBlock} (${logs.length} logs)`);
  }

  logs.sort((a, b) => {
    return a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex || a.index - b.index;
  });

  for (const log of logs) {
    // console.log(log);
    const from = log.args[1];
    const to = log.args[2];
    const tokenId = log.args[3];
    const amount = log.args[4];

    if (!tokenIds.includes(tokenId)) {
      continue;
    }

    if (!amountMap.has(to)) {
      amountMap.set(to, 0n);
    }

    const currentAmount = amountMap.get(to);
    amountMap.set(to, currentAmount + amount);

    if (!amountMap.has(from)) {
      amountMap.set(from, 0n);
    }
    const currentAmountFrom = amountMap.get(from);
    amountMap.set(from, currentAmountFrom - amount);
  }

  const addresses = [];

  for (const [address, amount] of amountMap) {
    if (amount > 0n) {
      if (excludedAddresses.includes(address.toLowerCase())) {
        continue;
      }
      for (let i = 0n; i < amount; i++) {
        addresses.push(address);
      }
    }
  }

  fs.writeFileSync("holders.json", JSON.stringify(addresses, null, 2));
}
main();
