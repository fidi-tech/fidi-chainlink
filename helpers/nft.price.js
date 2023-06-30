import web3Mainnet from './web3.mainnet';
import abi from './nft.abi.json';
import {NFTS} from './nfts';

const CONTRACTS = {
  [NFTS.BORED_APE]: new web3Mainnet.eth.Contract(abi, '0x352f2Bc3039429fC2fe62004a1575aE74001CfcE'),
  [NFTS.COOL_CATS]: new web3Mainnet.eth.Contract(abi, '0xF49f8F5b931B0e4B4246E4CcA7cD2083997Aa83d'),
  [NFTS.CRYPTO_PUNKS]: new web3Mainnet.eth.Contract(abi, '0x01B6710B01cF3dd8Ae64243097d91aFb03728Fdd'),
};

const fractionDigits = 4;

export const getNftPrice = async (nft) => {
  const contract = CONTRACTS[nft];

  const [
    decimals,
    {answer},
  ] = await Promise.all([
    contract.methods.decimals().call(),
    contract.methods.latestRoundData().call(),
  ]);

  return Number(BigInt(answer) * (10n ** BigInt(fractionDigits)) / (10n ** BigInt(decimals))) / (10 ** fractionDigits);
};

