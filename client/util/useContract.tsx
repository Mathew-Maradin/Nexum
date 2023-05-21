import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import ABIObject from "../contract.json";

export const useContract = () => {
  const CONTRACT_ADDY = "0x6975316eF1e04811335d01431482de73d37FAE7B";
  const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_URL as string);
  const contract = new web3.eth.Contract(ABIObject.abi, CONTRACT_ADDY);

  return { contract, address: CONTRACT_ADDY };
};
