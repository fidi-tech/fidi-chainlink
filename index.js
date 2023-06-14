const Web3 = require('web3');
const abi = require('./abi.json');

const rpcUrl = 'https://rpc.api.moonbeam.network';
const web3 = new Web3(rpcUrl);

const contracts = [
  '0x9ce2388a1696e22F870341C3FC1E89710C7569B5',
  '0x4497B606be93e773bbA5eaCFCb2ac5E2214220Eb',
  '0xA122591F60115D63421f66F752EF9f6e0bc73abC',
];
const fractionDigits = 4;

(async () => {
  console.log("pair\tprice\ttimestamp");
  for (const contractAddress of contracts) {
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
      const [
        description,
        decimals,
        {answer},
        timestamp,
      ] = await Promise.all([
        contract.methods.description().call(),
        contract.methods.decimals().call(),
        contract.methods.latestRoundData().call(),
        contract.methods.latestTimestamp().call(),
      ]);

      const price = Number(BigInt(answer) * (10n ** BigInt(fractionDigits)) / (10n ** BigInt(decimals))) / (10 ** fractionDigits);
      console.log(`${description}\t${price}\t${new Date(timestamp * 1000).toISOString()}`);
    } catch (err) {
      console.error(err);
    }
  }
})();

