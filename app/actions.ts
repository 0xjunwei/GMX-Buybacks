"use server"

import {
  fetchArbiscanTokenTransactions,
  fetchSnowscanTokenTransactions,
  fetchArbiscanTokenBalance,
  fetchSnowscanTokenBalance,
  fetchGMXPrice,
  getOutflowTransactions,
  calculateUsdValue,
  type TokenBalance,
  fetchArbiscanAllTokenBalances,
  fetchSnowscanAllTokenBalances,
  fetchTokenPrices,
  updateTokenBalancesWithPrices,
  getCombinedTokenBalances,
  getCommonTokens,
  fetchBuybackTokenBalances,
  updateBuybackTokensWithPrices,
} from "@/lib/api"

export async function fetchAllData() {
  // Fetch all data in parallel
  const [arbTransactions, avaxTransactions, arbBalance, avaxBalance, gmxPrice] = await Promise.all([
    fetchArbiscanTokenTransactions(),
    fetchSnowscanTokenTransactions(),
    fetchArbiscanTokenBalance(),
    fetchSnowscanTokenBalance(),
    fetchGMXPrice(),
  ])

  // Combine transactions
  const allTransactions = [...arbTransactions, ...avaxTransactions]

  // Get outflow transactions
  const outflowTransactions = getOutflowTransactions(allTransactions)

  // Update USD values for balances
  const updatedArbBalance = arbBalance
    ? {
        ...arbBalance,
        usdValue: calculateUsdValue(arbBalance.formattedBalance, gmxPrice),
      }
    : null

  const updatedAvaxBalance = avaxBalance
    ? {
        ...avaxBalance,
        usdValue: calculateUsdValue(avaxBalance.formattedBalance, gmxPrice),
      }
    : null

  return {
    outflowTransactions,
    balances: [updatedArbBalance, updatedAvaxBalance].filter(Boolean) as TokenBalance[],
    gmxPrice,
  }
}

export async function fetchAllTokenBalances() {
  try {
    // Fetch all token balances in parallel
    const [arbTokenBalances, avaxTokenBalances, buybackTokens] = await Promise.all([
      fetchArbiscanAllTokenBalances(),
      fetchSnowscanAllTokenBalances(),
      fetchBuybackTokenBalances(),
    ])

    console.log("Arbitrum tokens:", arbTokenBalances.tokens.length)
    console.log("Avalanche tokens:", avaxTokenBalances.tokens.length)
    console.log("Buyback tokens:", buybackTokens.length)

    // Combine all tokens for price fetching
    const allTokens = [...arbTokenBalances.tokens, ...avaxTokenBalances.tokens, ...buybackTokens]

    // Fetch prices for all tokens
    const prices = await fetchTokenPrices(allTokens)

    // Update token balances with prices
    const updatedArbTokenBalances = updateTokenBalancesWithPrices(arbTokenBalances, prices)
    const updatedAvaxTokenBalances = updateTokenBalancesWithPrices(avaxTokenBalances, prices)
    const updatedBuybackTokens = updateBuybackTokensWithPrices(buybackTokens, prices)

    // Get combined totals
    const combined = getCombinedTokenBalances(updatedArbTokenBalances, updatedAvaxTokenBalances)

    // Get common tokens
    const commonTokens = getCommonTokens(updatedArbTokenBalances, updatedAvaxTokenBalances)

    return {
      arbitrum: updatedArbTokenBalances,
      avalanche: updatedAvaxTokenBalances,
      combined,
      commonTokens,
      buybackTokens: updatedBuybackTokens,
    }
  } catch (error) {
    console.error("Error in fetchAllTokenBalances:", error)
    // Return empty data
    return {
      arbitrum: {
        network: "arbitrum",
        address: "0x7eb417637a3e6d1c19e6d69158c47610b7a5d9b3",
        tokens: [],
        totalUsdValue: 0,
      },
      avalanche: {
        network: "avalanche",
        address: "0x1a3a103f9f536a0456c9b205152a3ac2b3c54490",
        tokens: [],
        totalUsdValue: 0,
      },
      combined: {
        totalUsdValue: 0,
        tokenCount: 0,
      },
      commonTokens: [],
      buybackTokens: [],
    }
  }
}
