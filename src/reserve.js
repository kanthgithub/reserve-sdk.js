import ReserveContract from './reserve_contract'
import SanityRatesContract from './sanity_rates_contract'
import ConversionRatesContract from './conversion_rates_contract'

/**
 * Reserve is the wrapper to call all methods related to
 * managing a reserve. It required a provider and the addresses of
 * reserve contract, conversionRates contract and optionally, SanityRates contract
 */
export default class Reserve {
  /**
   *
   * @param {object} provider - Web3 provider
   * @param {Addresses} addresses - addresses of the contracts
   */
  constructor (provider, addresses) {
    this.reserve = new ReserveContract(provider, addresses.reserve)
    this.conversionRates = new ConversionRatesContract(
      provider,
      addresses.conversionRates
    )
    if (addresses.sanityRates) {
      this.sanityRates = new SanityRatesContract(
        provider,
        addresses.sanityRates
      )
    }
  }

  /**
   * enableTrade allow the reserve to continue trading
   * @param {object} account - Admin account
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   * @return {object} - the tx object of send() command from this contract method
   */
  enableTrade (account, gasPrice) {
    return this.reserve.enableTrade(account, gasPrice)
  }
  /**
   * disableTrade stop the reserve from trading
   * @param {object} account - Alerter account
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   * @return {object} - the tx object of send() command from this contract method
   */
  disableTrade (account, gasPrice) {
    return this.reserve.disableTrade(account, gasPrice)
  }
  /**
   * tradeEnabled return true if the reserve is tradeEnabled, false otherwise
   * @return {boolean} - tradeEnabled status of the reserve
   */
  tradeEnabled () {
    return this.contract.methods.tradeEnabled().call()
  }

  /**
   * set Contract addresses for reserve contract.
   * @param {object} account - admin account.
   * @param {string} network - address of kyber network smart contract.
   * @param {string} conversion - address of kyber network smart contract.
   * @param {string} sanity (optional) - address of sanity rates contract.
   * @param {number} [gasPrice=undefined] - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */
  setContracts (account, network, conversion, sanity, gasPrice = undefined) {
    return this.reserve.setContracts(
      account,
      network,
      conversion,
      sanity,
      gasPrice
    )
  }

  /**
   * conversionRatesContract return the address of conversion rates of this reserve
   * @return {string} - address of conversion rates contract
   */
  conversionRatesContract () {
    return this.reserve.conversionRatesContract()
  }

  /**
   * sanityRatesContract return the address of sanity rates of this reserve
   * @return {string} - address of sanity rates contract
   */
  sanityRatesContract () {
    return this.reserve.sanityRatesContract()
  }
  /**
   * kyberNetwork return the address of kyberNetwork contract of this reserve
   * @return {string} - address of kyberNetwork contract
   */
  kyberNetwork () {
    return this.reserve.kyberNetwork()
  }

  /**
   * approve withdraw address for a token on reserve.
   * @param {object} account - admin account.
   * @param {string} tokenAddress - contract address of the modifying token.
   * @param {string} withdrawAddress - address for withdrawal.
   * @param {number} [gasPrice=undefined] - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */
  approveWithdrawAddress (
    account,
    tokenAddress,
    withdrawAddress,
    gasPrice = undefined
  ) {
    return this.reserve.approveWithdrawAddress(
      account,
      tokenAddress,
      withdrawAddress,
      gasPrice
    )
  }

  /**
   * disapprove withdraw address for a token on reserve.
   * @param {object} account - admin account.
   * @param {string} tokenAddress - contract address of the modifying token.
   * @param {string} withdrawAddress - address for withdrawal.
   * @param {number} [gasPrice=undefined] - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */
  disapproveWithdrawAddress (
    account,
    tokenAddress,
    withdrawAddress,
    gasPrice = undefined
  ) {
    return this.reserve.disapproveWithdrawAddress(
      account,
      tokenAddress,
      withdrawAddress,
      gasPrice
    )
  }

  /**
   * check for approval status of a token address to a particular address
   * @param {object} address - address to withdraw the token to
   * @param {string} tokenAddress - address of the token's smart contract. Must be deployed already.
   * @returns {boolean} - true for approved, false otherwise
   */
  approvedWithdrawAddresses (address, tokenAddress) {
    return this.reserve.approvedWithdrawAddresses(address, tokenAddress)
  }

  /**
   * withdraw an amount of token to specified account
   * @param {object} account - admin account.
   * @param {string} tokenAddress - address of the token's smart contract. Must be deployed already.
   * @param {object} amount - amount to withdraw (BN|String|int), must be in wei.
   * @param {string} toAddress - address for withdrawal. Must be approved already.
   * @param {number} [gasPrice=undefined] - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */
  withdraw (account, tokenAddress, amount, toAddress, gasPrice = undefined) {
    return this.reserve.withdraw(
      account,
      tokenAddress,
      amount,
      toAddress,
      gasPrice
    )
  }

  /**
   * Return balance of given token.
   * @param {string} token - address of token to check balance.
   * @return {number} - balance of given token
   */
  getBalance (token) {
    return this.reserve.getBalance(token)
  }

  /**
   * Set Sanity Rate for the sanity Ratescontract
   * @param {object} account - operator account
   * @param {string[]} srcs - list of source ERC20 token contract addresses
   * @param {uint[]} rates - list of Rates in ETH weit
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */
  setSanityRates (account, srcs, rates, gasPrice) {
    if (!this.sanityRates) {
      return undefined
    }
    return this.sanityRates.setSanityRates(account, srcs, rates, gasPrice)
  }

  /**
   * Return the sanity Rate of a pair of token
   * @param {string} src - ERC20 token contract address of source token
   * @param {string} dest - ERC20 token contract address of destination token
   * @returns {string} - the uint rate in strings format.
   */
  getSanityRate (src, dest) {
    if (!this.sanityRates) {
      return undefined
    }
    return this.sanityRates.getSanityRate(src, dest)
  }

  /**
   * resonableDiffInBps return the list of reasonableDiffs in basis points (bps)
   * @param {string} address - ERC20 token contract address to query
   * @returns {string} - the uint reasonable diff in string format.
   */
  reasonableDiffInBps (address) {
    if (!this.sanityRates) {
      return undefined
    }
    return this.sanityRates.reasonableDiffInBps(address)
  }

  /**
   * setResonableDiff Set reasonable conversion rate difference in percentage (any conversion rate outside of this range is considered unreasonable).
   * @param {object} account - admin account
   * @param {string[]} addresses - list of ERC20 token contract to set
   * @param {uint[]} diffs - list of diffs in bps (1 bps = 0.01%)
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */
  setReasonableDiff (account, addresses, diffs, gasPrice) {
    if (!this.sanityRates) {
      return undefined
    }
    return this.sanityRates.setReasonableDiff(
      account,
      addresses,
      diffs,
      gasPrice
    )
  }

  /**
   * Add a ERC20 token and its pricing configurations to reserve contract and
   * enable it for trading.
   * @param {object} account - Web3 account
   * @param {string} token - ERC20 token address
   * @param {TokenControlInfo} tokenControlInfo - https://developer.kyber.network/docs/VolumeImbalanceRecorder#settokencontrolinfo
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   * @returns {object} - the tx object of send() command from this contract method
   */

  addToken (account, token, tokenControlInfo, gasPrice) {
    return this.conversionRates.addToken(
      account,
      token,
      tokenControlInfo,
      gasPrice
    )
  }

  /**
   * Set adjustments for tokens' buy and sell rates depending on the net traded
   * amounts. Only operator can invoke.
   * @param {object} account - Web3 account
   * @param {string} token - ERC20 token address
   * @param {StepFunctionDataPoint[]} buy - array of buy step function configurations
   * @param {StepFunctionDataPoint[]} sell - array of sell step function configurations
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   */
  setImbalanceStepFunction (account, token, buy, sell, gasPrice) {
    return this.conversionRates.setImbalanceStepFunction(
      account,
      token,
      buy,
      sell,
      gasPrice
    )
  }

  /**
   * Set adjustments for tokens' buy and sell rates depending on the size of a
   * buy / sell order. Only operator can invoke.
   * @param {object} account - Web3 account
   * @param {string} token - ERC20 token address
   * @param {StepFunctionDataPoint[]} buy - array of buy step function configurations
   * @param {StepFunctionDataPoint[]} sell - array of sell step function configurations
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   */
  setQtyStepFunction (account, token, buy, sell, gasPrice) {
    return this.conversionRates.setQtyStepFunction(
      account,
      token,
      buy,
      sell,
      gasPrice
    )
  }

  /**
   * Return the buying ETH based rate. The rate might be vary with
   * different quantity.
   * @param {string} token - token address
   * @param {number} qty - quantity of token
   * @param {number} [currentBlockNumber=0] - current block number, default to
   * use latest known block number.
   * @return {number} - buy rate
   */
  getBuyRates (token, qty, currentBlockNumber = 0) {
    return this.conversionRates.getBuyRates(token, qty, currentBlockNumber)
  }

  /**
   * Return the buying ETH based rate. The rate might be vary with
   * different quantity.
   * @param {string} token - token address
   * @param {number} qty - quantity of token
   * @param {number} [currentBlockNumber=0] - current block number
   * known block number.
   */
  getSellRates (token, qty, currentBlockNumber = 0) {
    return this.conversionRates.getSellRates(token, qty, currentBlockNumber)
  }

  /**
   * Set the buying rate for given token.
   * @param {object} account - Web3 account
   * @param {RateSetting[]} rates - token address
   * @param {number} [currentBlockNumber=0] - current block number
   * @param {number} gasPrice (optional) - the gasPrice desired for the tx
   */
  setRate (account, rates, currentBlockNumber = 0, gasPrice) {
    return this.conversionRates.setRate(
      account,
      rates,
      currentBlockNumber,
      gasPrice
    )
  }
}
