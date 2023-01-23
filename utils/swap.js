import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

/*
    getAmountOfTokensReceivedFromSwap:  Returns the number of Eth/Crypto Dev tokens that can be received 
    when the user swaps `_swapAmountWei` amount of Eth/Crypto Dev tokens.
*/
export const getAmountOfTokensReceivedFromSwap = async (
    _swapAmountWei, // input amount of either Eth/CD tokens, 1st input
    provider,       // to return the contract_abs. object
    ethSelected,    // true / false
    ethBalance,     // ethReserve, 2nd input
    reservedCD      // CDReserve, 3rd input
  ) => {
    // no arrow f() => needed to return deployed contract's instance
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
      );
      
      let amountOfTokens;   

    // If `Eth` is not selected this means our input value is `Crypto Dev` tokens which means our input amount would be
    // `_swapAmountWei`, the input reserve would be the `Crypto Dev` token reserve of the contract and output reserve
    // would be the `ethBalance`
    if (ethSelected) {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
          _swapAmountWei,
          ethBalance,
          reservedCD
        );
    }
    // If `Eth` is not selected this means our input value is `Crypto Dev` tokens which means our input amount would be
    // `_swapAmountWei`, the input reserve would be the `Crypto Dev` token reserve of the contract and output reserve
    // would be the `ethBalance
        else {
            amountOfTokens = await exchangeContract.getAmountOfTokens(
                _swapAmountWei,
                reservedCD,
                ethBalance
              );
        }
        return amountOfTokens;  
        // getAmountOfTokensReceivedFromSwap() returns this value to the var. on LHS
};

/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with...
  tokenBought OR ethBought >= `tokenToBeReceivedAfterSwap` amount of Crypto Dev tokens/Eth.
*/

// tokenToBeReceivedAfterSwap sort of expectation

export const swapTokens = async (
    signer,                         // setter
    swapAmountWei,                  // input eth/CD token for swap with CD/Eth
    tokenToBeReceivedAfterSwap,     // output CD / Eth for input Eth/CD
    ethSelected                     // true / false
  ) => {
    // Create a new instance of the Exchange contract
    const exchangeContract = new Contract(      // call ethToCryptoDevToken()/cryptoDevTokenToEth
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
      );
    // Create a new instance of the ICO_Token contract
      const tokenContract = new Contract(       // call .approve(), .transfer(), .transferFrom()
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      let tx;

    // If Eth is selected call the `ethToCryptoDevToken` function else
    // call the `cryptoDevTokenToEth` function from the contract
    
    // As you can see you need to pass the `swapAmount` as a value to the function because
    // it is the ether we are paying to the contract, instead of a value we are passing to the function
    if (ethSelected) {
        tx = await exchangeContract.ethToCryptoDevToken(
          tokenToBeReceivedAfterSwap,   // BUT, tokenBought ( >= `tokenToBeReceivedAfterSwap`) sent
          {
            value: swapAmountWei,
          }
        );
    }
    else {
    // User has to approve `swapAmountWei` for the contract because `Crypto Dev` token
    // is an ERC20
        tx = await tokenContract.approve(
          EXCHANGE_CONTRACT_ADDRESS,
          swapAmountWei.toString()
        );
        
    await tx.wait();    // DRY, common .wait() for both the above tx

    // call cryptoDevTokenToEth function which would take in `swapAmountWei` of `Crypto Dev` tokens and would
    // send back ethBought >= `tokenToBeReceivedAfterSwap` amount of `Eth` to the user
    tx = await exchangeContract.cryptoDevTokenToEth(
        swapAmountWei,
        tokenToBeReceivedAfterSwap  // BUT, ethBought ( >= `tokenToBeReceivedAfterSwap`) sent
      );
    }
    await tx.wait();
};


  

  
