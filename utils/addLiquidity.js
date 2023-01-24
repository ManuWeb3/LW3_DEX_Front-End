import { Contract, utils } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";
/**
 * addLiquidity helps add liquidity to the exchange,
 * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
 * to the exchange. If he is adding the liquidity after the initial liquidity has already been added
 * then we calculate (user does not need to, better UX) the Crypto Dev tokens he can add, given the Eth he wants to add by keeping the ratios
 * constant
 */
export const addLiquidity = async (
    signer,           // setter
    addCDAmountWei,   // CD Token amount
    addEtherAmountWei // ETH amount, as both ETH and CD Token need to be added to the pool in the same txn by user/LP
  ) => {
    try {
      // create a new instance of the token contract
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      // create a new instance of the exchange contract
      const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
      );
      // Because CD tokens are an ERC20, user would need to give the contract allowance
      // to take the required number CD tokens out of his contract
      let tx = await tokenContract.approve(
        EXCHANGE_CONTRACT_ADDRESS,
        addCDAmountWei.toString()
      );
      await tx.wait();
      // After the contract has the approval, add the ether and cd tokens in the liquidity
      tx = await exchangeContract.addLiquidity(addCDAmountWei, {
        value: addEtherAmountWei,
      });
      await tx.wait();
    } catch (err) {
      console.error(err);
    }
  };
/**
 * calculateCD calculates the CD tokens that need to be added to the liquidity
 * given `_addEtherAmountWei` amount of ether
 * Though addLiquidity() above auto-calculates the CD Tokens' amount to be sent from user to match the ratio,
 * we need this f() specially to calc. the CD Tokens amount for some individual calc. in React pages/index.js
 */
// usual 3 params needed to calc. the 4th one
// in this case, we need ethAmount (entered from UI), ethBalance/Reserve, and tokenReserve
export const calculateCD = async (
  _addEther = "0",
  etherBalanceContract,
  cdTokenReserve
) => {
  // `_addEther` is a string, we need to convert it to a Bignumber before we can do our calculations
  // We do that using the `parseEther` function from `ethers.js`
  
  // Solidity's addLiquidity() implicitly does the calculations...
  // BUT, in JS, to use this calcCD() individually, we need to do type-conversions
  // ether(string) => Wei (BigNumber) using utils.parseEther()
  const _addEtherAmountWei =  utils.parseEther(_addEther)   // no await needed
 
  // using the 'Golden Ratio', we'll calculate the CD Tokens' amount needed to be deplosited by user to keep ratio the same
  // as _addEtherAmountWei is a BigNumber Object, CANNOT use * + /, have to use .mul(), .div(), .add()
  // hence, cannot give a smooth order, have to strat with _addEtherAmountWei.mul().div()
  const cryptoDevTokenAmount = _addEtherAmountWei
  .mul(cdTokenReserve)
  .div(etherBalanceContract);

  return cryptoDevTokenAmount;
  // then only calculateCD() will return the amount saved / calculated in cryptoDevTokenAmount

}

