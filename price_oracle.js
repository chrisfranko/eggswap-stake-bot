require('dotenv').config();
const schedule = require('node-schedule');

const { ethers } = require("ethers");
const utils = require('ethers').utils;

const fetch = require("node-fetch");

const provider = new ethers.providers.JsonRpcProvider("https://node.expanse.tech", {
    name: "custom",
    chainId: 2
});

const privKey = process.env.PRIVKEY;
const wallet = new ethers.Wallet(privKey, provider);
/*
  Create Contract from abi and addr
*/
const ABI = require("./abi/abi.PriceOracle.json");
const ADDR = "0xc3711801626c2fb96bDbA3B31FF644Db531f6040";
const CONTRACT = new ethers.Contract(ADDR, ABI, wallet);

//let tokens = [LAB];

let gasPrice = 1000000000;
let gasLimit = 7000000;

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

/* Main function because we like async and await  */
async function job(nextJob){
  console.log('Starting Price Oracle Bot.')

  //get usd price
  try{
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=expanse&vs_currencies=usd');
    const data = await response.json();
    const wei = utils.parseEther(data.expanse.usd.toString());
    //set use price
    console.log(`Setting USD Price : ${data.expanse.usd}`);
    const tx = await CONTRACT.setPriceUsd(wei, { gasPrice: gasPrice, gasLimit: gasLimit});
    await waitForTx(provider, tx.hash)

    console.log(`Finished conversion. Next job @ ${nextJob}`)
  }catch(e){
    console.log(JSON.stringify(e));
  }
  
}


async function run(){
  console.log("Starting the scheduler.")

  const start = schedule.scheduleJob('0 */1 * * *', async function(){
    await job(start.nextInvocation());
  });

  if(process.env.STARTUP_TRIGGER){
    console.log(`Initiating Price Oracle on startup.`)
    await job(start.nextInvocation());
  }

  console.log(`Next job @ ${start.nextInvocation()}`)
}
/* Start that mother flerkin */
run();
