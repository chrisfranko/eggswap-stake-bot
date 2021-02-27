require('dotenv').config();
const schedule = require('node-schedule');

const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://node.expanse.tech", {
    name: "custom",
    chainId: 2
});

const privKey = process.env.PRIVKEY;
const wallet = new ethers.Wallet(privKey, provider);
/*
  Create Contract from abi and addr
*/
const ABI = require("./abi/abi.EggMaker.json");
const ADDR = "0xaCFe49957B0F794455DB556b01fF5943B36B69A9";
const CONTRACT = new ethers.Contract(ADDR, ABI, wallet);


/*
  TTASTY OKENS
*/
const WEXP = {name: 'WEXP', addr: '0x331631B4bb93b9B8962faE15860BD538a389395A'}; // WEXP

const LAB = {name: 'LAB', addr: '0x3b4cfcc4532eec161860cb6544f49947544d940d'};
const LOVE = {name: 'LOVE', addr: '0x9D2761A714b5b2EfA325a8a3eee21BE32AACeB4A'};
const EGG = {name: 'EGG', addr: '0xd1365a5Af713cde10C6ac3fB9EDBB2bBbd4B2Ba2'};
const T64 = {name: 'T64', addr: '0x72332c512bf2dA5A7Cd11752b380F7d8fcBba847'};
const PEX = {name: 'PEX', addr: '0x4f5ec5a69dbe12c48ca1edc9c52b1e8896aed932'};

const WAGMI = {name: 'WAGMI', addr: '0x0D14F385647E66283E8E5D9c567296751Ac7ee7D'};
const SVIT = {name: 'SVIT', addr: '0x54451dBE4B925aa5E312E232c6Cba2EAA0d98169'};
const PRM = {name: 'PRM', addr: '0x87Eb2fdF607B46F324984771FfDF2A0396139bDf'};

let tokens = [LAB, LOVE, EGG, T64, PEX, WAGMI, SVIT, PRM];
//let tokens = [LAB];

let gasPrice = 10000000000;
let gasLimit = 100000;

/* Helper functions */
const waitForTx = async (provider, hash) => {
    console.log(`Waiting for tx: ${hash}...`)
    while (!await provider.getTransactionReceipt(hash)) {
        sleep(5000)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Main function because we like async and await
async function main(){
console.log('Starting asset conversion on the EggMaker contract.')

  for (i = 0; i < tokens.length; i++) {

    console.log(`Converting Token: ${tokens[i].name}  Address: ${tokens[i].addr}`);
    const tx = await CONTRACT.convert(WEXP.addr, tokens[i].addr, { gasPrice: gasPrice, gasLimit: gasLimit});
    await waitForTx(provider, tx.hash)
  }

console.log(`Finished conversion. Next job @ ${start.nextInvocation()}`)
}
 */


/* Start that mother flerkin */
console.log("Starting the scheduler.")

const start = schedule.scheduleJob('0 */2 * * *', async function(){
console.log('Starting asset conversion on the EggMaker contract.')

  for (i = 0; i < tokens.length; i++) {

    console.log(`Converting Token: ${tokens[i].name}  Address: ${tokens[i].addr}`);
    const tx = await CONTRACT.convert(WEXP.addr, tokens[i].addr, { gasPrice: gasPrice, gasLimit: gasLimit});
    await waitForTx(provider, tx.hash)
  }

console.log(`Finished conversion. Next job @ ${start.nextInvocation()}`)
});

console.log(`Next job @ ${start.nextInvocation()}`)
