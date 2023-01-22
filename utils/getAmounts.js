import { Contract } from "ethers";
// to instantiate an alrerady deployed contract (deploy.js)
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

/**
 * getEtherBalance: Retrieves the ether balance of the user (default) or the contract (both addresses)
 */
// no need to use extcode() to check whether it's a contract
// just get the input from user as true/false
// getter
export const getEtherBalance = async (provider, address, contract = false) => {
  try {
    // If the caller has set the `contract` boolean to true, retrieve the balance of
    // ether in the `exchange contract`, if it is set to false, retrieve the balance
    // of the user's address
    // .balanceOf(contract) won't work bcz that's for ERC20 token
    // similarly, what about user's ETHER balance
    // both provider.getBalance(either address)
    if (contract) {
      const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
      return balance;
    } else {
      const balance = await provider.getBalance(address);
      return balance;
    }
  } catch (err) {
    console.error(err);
    return 0;
    // else default JS return is undefined and if it gets returned...
    // it will be difficult to deal with in the code
  }
};

/**
 * getCDTokensBalance: Retrieves the Crypto Dev tokens in the account
 * of the provided `address` (either of the user / contract)
 */
export const getCDTokensBalance = async (provider, address) => {
    try {
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      // 3 inputs needed to interact with any contract
      // tokenContract needed for .balanceOf() ERC20 CD token, irrespective of user/contract, any address
      const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
      return balanceOfCryptoDevTokens;
    } catch (err) {
      console.error(err);
      // return 0; - should be present likewise above
    }
  };
  /**
 * getLPTokensBalance: Retrieves the amount of LP tokens in the account
 * of the provided `address`
 */
  export const getLPTokensBalance = async (provider, address) => {
    try {
      const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
      );
      const balanceOfLPTokens = await exchangeContract.balanceOf(address);
      return balanceOfLPTokens;
    } catch (err) {
      console.error(err);
    }
  };

  /**
 * getReserveOfCDTokens: Retrieves the amount of CD tokens in the
 * exchange contract address (not user)
 */
export const getReserveOfCDTokens = async (provider) => {
    try {
      const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
      );
      const reserve = await exchangeContract.getReserve();
      return reserve;
    } catch (err) {
      console.error(err);
    }
  };