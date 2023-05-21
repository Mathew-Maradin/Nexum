import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import ABIObject from "../contract.json";

export const useContract = () => {
  const CONTRACT_ADDY = "0x296C2744b9C20DF4d63817614f3aB25D4d285BF9";
  const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_URL as string);
  const contract = new web3.eth.Contract(ABIObject.abi, CONTRACT_ADDY);

  return { contract, address: CONTRACT_ADDY };
};
