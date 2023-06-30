import web3Moonbeam from './web3.moonbeam';
import abi from './abi.json';
import {TOKENS} from './tokens';

const CONTRACTS = {
  [TOKENS.BTC]: new web3Moonbeam.eth.Contract(abi, '0x8c4425e141979c66423A83bE2ee59135864487Eb'),
  [TOKENS.DOT]: new web3Moonbeam.eth.Contract(abi, '0x1466b4bD0C4B6B8e1164991909961e0EE6a66d8c'),
  [TOKENS.ETH]: new web3Moonbeam.eth.Contract(abi, '0x9ce2388a1696e22F870341C3FC1E89710C7569B5'),
  [TOKENS.GLMR]: new web3Moonbeam.eth.Contract(abi, '0x4497B606be93e773bbA5eaCFCb2ac5E2214220Eb'),
};

const fractionDigits = 4;

export const getPrice = async (token) => {
  const contract = CONTRACTS[token];

  const [
    decimals,
    {answer},
  ] = await Promise.all([
    contract.methods.decimals().call(),
    contract.methods.latestRoundData().call(),
  ]);

  return Number(BigInt(answer) * (10n ** BigInt(fractionDigits)) / (10n ** BigInt(decimals))) / (10 ** fractionDigits);
};

