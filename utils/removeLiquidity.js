import { Contract, providers, utils, BigNumber } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
} from "../constants";

/**
 * removeLiquidity: Removes the `removeLPTokensWei` amount of LP tokens from
 * liquidity and also the calculated amount of `ether` and `CD` tokens
 */
// signer as it's a setter
// 1st arg. to return JS object of contract's abstraction
// and 2nd arg to input in the Solidity's removeLiquidity() itself
export const removeLiquidity = async (signer, removeLPTokensWei) => {
    // Create a new instance of the exchange contract
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );

    const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);

    await tx.wait();
    // action taken, no return here
    // return is when we calculated something and return it as it's a "getter" thing
  };
  
  /**
 * getTokensAfterRemove: Calculates the amount of `Eth` and `CD` tokens
 * that would be returned back to user after he removes `removeLPTokenWei` amount
 * of LP tokens from the contract, means from the supply (not contract reserve)
 */
  // provider for getter
  // removeLPTokenWei - done
  // _totalSupply from totalSupply() of ERC20 inherited in Exchange.sol
  // _ethBalance and cryptoDevTokenReserve - denominators to get both the numerators of...
  // eth and CD tokens to be sent to the user upon burn(CD LP)
  export const getTokensAfterRemove = async (
    provider,
    removeLPTokenWei,
    _ethBalance,
    cryptoDevTokenReserve
  ) => {
    try {
        // Create a new instance of the exchange contract
        const exchangeContract = new Contract(
          EXCHANGE_CONTRACT_ADDRESS,
          EXCHANGE_CONTRACT_ABI,
          provider
        );
        // Get the total supply of `Crypto Dev` LP tokens
    const _totalSupply = await exchangeContract.totalSupply();
            // -------------------- pending----------------------
    }
    catch (err) {
        console.error(err);
      }
  }