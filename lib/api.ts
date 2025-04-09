import { formatUnits } from "viem"

// Contract addresses
export const ARBITRUM_CONTRACT = "0x7eb417637a3e6d1c19e6d69158c47610b7a5d9b3"
export const AVALANCHE_CONTRACT = "0x1a3a103f9f536a0456c9b205152a3ac2b3c54490"

// GMX token addresses
export const ARBITRUM_GMX = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a"
export const AVALANCHE_GMX = "0x62edc0692bd897d2295872a9ffcac5425011c661"

// Token decimals
export const GMX_DECIMALS = 18

// Buyback tokens
export const BUYBACK_TOKENS = {
  arbitrum: [
    { address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", name: "Tether USD", decimals: 6 },
    { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", symbol: "WETH", name: "Wrapped Ether", decimals: 18 },
    { address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8 },
  ],
  avalanche: [
    { address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", symbol: "USDT", name: "Tether USD", decimals: 6 },
    { address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", symbol: "WAVAX", name: "Wrapped AVAX", decimals: 18 },
    { address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50", symbol: "BTC.b", name: "Bitcoin.b", decimals: 8 },
    { address: "0x50b7545627a5162F82A992c33b87aDc75187B218", symbol: "WBTC.e", name: "Wrapped Bitcoin", decimals: 8 },
  ],
}

// Types
export interface TokenTransaction {
  blockNumber: string
  timeStamp: string
  hash: string
  from: string
  to: string
  value: string
  tokenSymbol: string
  tokenName: string
  tokenDecimal: string
  formattedBalance?: number
  formattedValue: number
  network: "arbitrum" | "avalanche"
}

export interface TokenBalance {
  balance: string
  formattedBalance: number
  usdValue: number
  network: "arbitrum" | "avalanche"
}

// Types for token balances
export interface TokenInfo {
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  tokenDecimal: string
  balance: string
  formattedBalance: number
  usdValue: number
  network?: "arbitrum" | "avalanche"
}

export interface BuybackTokenInfo extends TokenInfo {
  network: "arbitrum" | "avalanche"
}

export interface ContractTokenBalances {
  network: "arbitrum" | "avalanche"
  address: string
  tokens: TokenInfo[]
  totalUsdValue: number
}

// Token price mapping for common tokens
const TOKEN_PRICE_MAPPING: Record<string, string> = {
  GMX: "gmx",
  WETH: "ethereum",
  ETH: "ethereum",
  WBTC: "wrapped-bitcoin",
  BTC: "bitcoin",
  "BTC.B": "bitcoin",
  BTCB: "bitcoin",
  "WBTC.E": "wrapped-bitcoin",
  USDC: "usd-coin",
  "USDC.E": "usd-coin",
  USDT: "tether",
  DAI: "dai",
  LINK: "chainlink",
  UNI: "uniswap",
  AAVE: "aave",
  CRV: "curve-dao-token",
  MKR: "maker",
  SNX: "synthetix-network-token",
  COMP: "compound-governance-token",
  BAL: "balancer",
  YFI: "yearn-finance",
  SUSHI: "sushi",
  "1INCH": "1inch",
  GRT: "the-graph",
  MATIC: "matic-network",
  FTM: "fantom",
  AVAX: "avalanche-2",
  WAVAX: "avalanche-2",
  FRAX: "frax",
  ARB: "arbitrum",
  OP: "optimism",
  PEPE: "pepe",
  WSTETH: "wrapped-steth",
  USDE: "usde",
  TBTC: "tbtc",
}

// Fetch token transactions from Arbiscan
export async function fetchArbiscanTokenTransactions(): Promise<TokenTransaction[]> {
  const apiKey = process.env.ARBISCAN_API_KEY
  const url = `https://api.arbiscan.io/api?module=account&action=tokentx&address=${ARBITRUM_CONTRACT}&sort=desc&apikey=${apiKey}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json()

    if (data.status === "1" && Array.isArray(data.result)) {
      return data.result
        .filter((tx: any) => tx.tokenSymbol === "GMX")
        .map((tx: any) => ({
          ...tx,
          formattedValue: Number.parseFloat(formatUnits(BigInt(tx.value), Number(tx.tokenDecimal))),
          network: "arbitrum" as const,
        }))
    }
    console.log("Arbiscan transactions response:", data)
    return []
  } catch (error) {
    console.error("Error fetching Arbiscan transactions:", error)
    return []
  }
}

// Fetch token transactions from Snowscan
export async function fetchSnowscanTokenTransactions(): Promise<TokenTransaction[]> {
  const apiKey = process.env.SNOWSCAN_API_KEY
  const url = `https://api.snowscan.xyz/api?module=account&action=tokentx&address=${AVALANCHE_CONTRACT}&sort=desc&apikey=${apiKey}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json()

    if (data.status === "1" && Array.isArray(data.result)) {
      return data.result
        .filter((tx: any) => tx.tokenSymbol === "GMX")
        .map((tx: any) => ({
          ...tx,
          formattedValue: Number.parseFloat(formatUnits(BigInt(tx.value), Number(tx.tokenDecimal))),
          network: "avalanche" as const,
        }))
    }
    console.log("Snowscan transactions response:", data)
    return []
  } catch (error) {
    console.error("Error fetching Snowscan transactions:", error)
    return []
  }
}

// Fetch token balance from Arbiscan
export async function fetchArbiscanTokenBalance(): Promise<TokenBalance | null> {
  const apiKey = process.env.ARBISCAN_API_KEY
  const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${ARBITRUM_GMX}&address=${ARBITRUM_CONTRACT}&tag=latest&apikey=${apiKey}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json()

    if (data.status === "1") {
      const balance = data.result
      const formattedBalance = Number.parseFloat(formatUnits(BigInt(balance), GMX_DECIMALS))

      // We'll update the USD value later
      return {
        balance,
        formattedBalance,
        usdValue: 0,
        network: "arbitrum",
      }
    }
    console.log("Arbiscan balance response:", data)
    return null
  } catch (error) {
    console.error("Error fetching Arbiscan balance:", error)
    return null
  }
}

// Fetch token balance from Snowscan
export async function fetchSnowscanTokenBalance(): Promise<TokenBalance | null> {
  const apiKey = process.env.SNOWSCAN_API_KEY
  const url = `https://api.snowscan.xyz/api?module=account&action=tokenbalance&contractaddress=${AVALANCHE_GMX}&address=${AVALANCHE_CONTRACT}&tag=latest&apikey=${apiKey}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json()

    if (data.status === "1") {
      const balance = data.result
      const formattedBalance = Number.parseFloat(formatUnits(BigInt(balance), GMX_DECIMALS))

      // We'll update the USD value later
      return {
        balance,
        formattedBalance,
        usdValue: 0,
        network: "avalanche",
      }
    }
    console.log("Snowscan balance response:", data)
    return null
  } catch (error) {
    console.error("Error fetching Snowscan balance:", error)
    return null
  }
}

// Fetch all token balances from Arbiscan
export async function fetchArbiscanAllTokenBalances(): Promise<ContractTokenBalances> {
  const apiKey = process.env.ARBISCAN_API_KEY
  // Use tokentx instead of tokenlist to get all tokens that have had transactions
  const url = `https://api.arbiscan.io/api?module=account&action=tokentx&address=${ARBITRUM_CONTRACT}&sort=desc&apikey=${apiKey}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json()

    let tokens: TokenInfo[] = []
    const totalUsdValue = 0

    if (data.status === "1" && Array.isArray(data.result)) {
      // Create a map to store unique tokens
      const tokenMap = new Map<string, TokenInfo>()

      // Process each transaction to extract token info
      for (const tx of data.result) {
        const tokenAddress = tx.contractAddress.toLowerCase()

        // Skip if we've already processed this token
        if (tokenMap.has(tokenAddress)) continue

        // Fetch the current balance for this token
        const balanceUrl = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${ARBITRUM_CONTRACT}&tag=latest&apikey=${apiKey}`
        const balanceResponse = await fetch(balanceUrl, { cache: "no-store" })
        const balanceData = await balanceResponse.json()

        if (balanceData.status === "1" && balanceData.result !== "0") {
          const balance = balanceData.result
          const formattedBalance = Number.parseFloat(formatUnits(BigInt(balance), Number(tx.tokenDecimal)))

          tokenMap.set(tokenAddress, {
            tokenAddress,
            tokenSymbol: tx.tokenSymbol,
            tokenName: tx.tokenName,
            tokenDecimal: tx.tokenDecimal,
            balance,
            formattedBalance,
            usdValue: 0, // Will be updated later
          })
        }
      }

      tokens = Array.from(tokenMap.values())
    }

    return {
      network: "arbitrum",
      address: ARBITRUM_CONTRACT,
      tokens,
      totalUsdValue,
    }
  } catch (error) {
    console.error("Error fetching Arbiscan token balances:", error)
    return {
      network: "arbitrum",
      address: ARBITRUM_CONTRACT,
      tokens: [],
      totalUsdValue: 0,
    }
  }
}

// Fetch all token balances from Snowscan
export async function fetchSnowscanAllTokenBalances(): Promise<ContractTokenBalances> {
  const apiKey = process.env.SNOWSCAN_API_KEY
  // Use tokentx instead of tokenlist to get all tokens that have had transactions
  const url = `https://api.snowscan.xyz/api?module=account&action=tokentx&address=${AVALANCHE_CONTRACT}&sort=desc&apikey=${apiKey}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json()

    let tokens: TokenInfo[] = []
    const totalUsdValue = 0

    if (data.status === "1" && Array.isArray(data.result)) {
      // Create a map to store unique tokens
      const tokenMap = new Map<string, TokenInfo>()

      // Process each transaction to extract token info
      for (const tx of data.result) {
        const tokenAddress = tx.contractAddress.toLowerCase()

        // Skip if we've already processed this token
        if (tokenMap.has(tokenAddress)) continue

        // Fetch the current balance for this token
        const balanceUrl = `https://api.snowscan.xyz/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${AVALANCHE_CONTRACT}&tag=latest&apikey=${apiKey}`
        const balanceResponse = await fetch(balanceUrl, { cache: "no-store" })
        const balanceData = await balanceResponse.json()

        if (balanceData.status === "1" && balanceData.result !== "0") {
          const balance = balanceData.result
          const formattedBalance = Number.parseFloat(formatUnits(BigInt(balance), Number(tx.tokenDecimal)))

          tokenMap.set(tokenAddress, {
            tokenAddress,
            tokenSymbol: tx.tokenSymbol,
            tokenName: tx.tokenName,
            tokenDecimal: tx.tokenDecimal,
            balance,
            formattedBalance,
            usdValue: 0, // Will be updated later
          })
        }
      }

      tokens = Array.from(tokenMap.values())
    }

    return {
      network: "avalanche",
      address: AVALANCHE_CONTRACT,
      tokens,
      totalUsdValue,
    }
  } catch (error) {
    console.error("Error fetching Snowscan token balances:", error)
    return {
      network: "avalanche",
      address: AVALANCHE_CONTRACT,
      tokens: [],
      totalUsdValue: 0,
    }
  }
}

// Fetch buyback token balances
export async function fetchBuybackTokenBalances(): Promise<BuybackTokenInfo[]> {
  const apiKey = {
    arbitrum: process.env.ARBISCAN_API_KEY,
    avalanche: process.env.SNOWSCAN_API_KEY,
  }

  const buybackTokens: BuybackTokenInfo[] = []

  // Fetch Arbitrum buyback tokens
  for (const token of BUYBACK_TOKENS.arbitrum) {
    try {
      const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${token.address}&address=${ARBITRUM_CONTRACT}&tag=latest&apikey=${apiKey.arbitrum}`
      const response = await fetch(url, { cache: "no-store" })
      const data = await response.json()

      if (data.status === "1" && data.result !== "0") {
        const balance = data.result
        const formattedBalance = Number.parseFloat(formatUnits(BigInt(balance), token.decimals))

        buybackTokens.push({
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          tokenName: token.name,
          tokenDecimal: token.decimals.toString(),
          balance,
          formattedBalance,
          usdValue: 0, // Will be updated later
          network: "arbitrum",
        })
      }
    } catch (error) {
      console.error(`Error fetching Arbitrum buyback token ${token.symbol}:`, error)
    }
  }

  // Fetch Avalanche buyback tokens
  for (const token of BUYBACK_TOKENS.avalanche) {
    try {
      const url = `https://api.snowscan.xyz/api?module=account&action=tokenbalance&contractaddress=${token.address}&address=${AVALANCHE_CONTRACT}&tag=latest&apikey=${apiKey.avalanche}`
      const response = await fetch(url, { cache: "no-store" })
      const data = await response.json()

      if (data.status === "1" && data.result !== "0") {
        const balance = data.result
        const formattedBalance = Number.parseFloat(formatUnits(BigInt(balance), token.decimals))

        buybackTokens.push({
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          tokenName: token.name,
          tokenDecimal: token.decimals.toString(),
          balance,
          formattedBalance,
          usdValue: 0, // Will be updated later
          network: "avalanche",
        })
      }
    } catch (error) {
      console.error(`Error fetching Avalanche buyback token ${token.symbol}:`, error)
    }
  }

  return buybackTokens
}

// Fetch token prices from CoinGecko
export async function fetchTokenPrices(tokens: TokenInfo[]): Promise<Record<string, number>> {
  try {
    // Extract unique token symbols
    const tokenSymbols = [...new Set(tokens.map((token) => token.tokenSymbol))]

    // Map token symbols to CoinGecko IDs
    const coinGeckoIds: string[] = []
    const symbolToIdMap: Record<string, string> = {}

    for (const symbol of tokenSymbols) {
      // Try to match the token symbol (case insensitive)
      const normalizedSymbol = symbol.toUpperCase()

      // Check if we have a direct mapping
      let coinGeckoId = TOKEN_PRICE_MAPPING[normalizedSymbol]

      // If not, try to find a match by removing .e, .b suffixes
      if (!coinGeckoId) {
        const baseName = normalizedSymbol.split(".")[0]
        coinGeckoId = TOKEN_PRICE_MAPPING[baseName]
      }

      if (coinGeckoId) {
        coinGeckoIds.push(coinGeckoId)
        symbolToIdMap[symbol] = coinGeckoId
      }
    }

    // If no valid tokens, return empty object
    if (coinGeckoIds.length === 0) {
      return {}
    }

    // Fetch prices from CoinGecko
    const idsParam = coinGeckoIds.join(",")
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd`, {
      cache: "no-store",
    })
    const data = await response.json()

    // Map CoinGecko response back to token symbols
    const priceMap: Record<string, number> = {}
    for (const [symbol, id] of Object.entries(symbolToIdMap)) {
      if (data[id]?.usd) {
        priceMap[symbol] = data[id].usd
      } else {
        // Fallback price for testing
        priceMap[symbol] = 1.0
      }
    }

    // Add fallback prices for common tokens if they're missing
    if (!priceMap["GMX"]) priceMap["GMX"] = 12.0
    if (!priceMap["WETH"]) priceMap["WETH"] = 3000.0
    if (!priceMap["ETH"]) priceMap["ETH"] = 3000.0
    if (!priceMap["WBTC"]) priceMap["WBTC"] = 75000.0
    if (!priceMap["BTC"]) priceMap["BTC"] = 75000.0
    if (!priceMap["BTC.B"]) priceMap["BTC.B"] = 75000.0
    if (!priceMap["BTCB"]) priceMap["BTCB"] = 75000.0
    if (!priceMap["WBTC.E"]) priceMap["WBTC.E"] = 75000.0
    if (!priceMap["USDC"]) priceMap["USDC"] = 1.0
    if (!priceMap["USDC.E"]) priceMap["USDC.E"] = 1.0
    if (!priceMap["USDT"]) priceMap["USDT"] = 1.0
    if (!priceMap["DAI"]) priceMap["DAI"] = 1.0
    if (!priceMap["ARB"]) priceMap["ARB"] = 0.25
    if (!priceMap["AVAX"]) priceMap["AVAX"] = 16.0
    if (!priceMap["WAVAX"]) priceMap["WAVAX"] = 16.0
    if (!priceMap["LINK"]) priceMap["LINK"] = 10.0
    if (!priceMap["AAVE"]) priceMap["AAVE"] = 120.0
    if (!priceMap["UNI"]) priceMap["UNI"] = 4.5
    if (!priceMap["PEPE"]) priceMap["PEPE"] = 0.000006
    if (!priceMap["WSTETH"]) priceMap["WSTETH"] = 3200.0
    if (!priceMap["USDE"]) priceMap["USDE"] = 1.0
    if (!priceMap["TBTC"]) priceMap["TBTC"] = 75000.0

    console.log("Fetched token prices:", priceMap)
    return priceMap
  } catch (error) {
    console.error("Error fetching token prices:", error)
    // Return fallback prices for common tokens
    return {
      GMX: 12.0,
      WETH: 3000.0,
      ETH: 3000.0,
      WBTC: 75000.0,
      BTC: 75000.0,
      "BTC.B": 75000.0,
      BTCB: 75000.0,
      "WBTC.E": 75000.0,
      USDC: 1.0,
      "USDC.E": 1.0,
      USDT: 1.0,
      DAI: 1.0,
      ARB: 0.25,
      AVAX: 16.0,
      WAVAX: 16.0,
      LINK: 10.0,
      AAVE: 120.0,
      UNI: 4.5,
      PEPE: 0.000006,
      WSTETH: 3200.0,
      USDE: 1.0,
      TBTC: 75000.0,
    }
  }
}

// Update token balances with USD values
export function updateTokenBalancesWithPrices(
  balances: ContractTokenBalances,
  prices: Record<string, number>,
): ContractTokenBalances {
  let totalUsdValue = 0

  const updatedTokens = balances.tokens.map((token) => {
    // Try to find price by exact symbol match
    let price = prices[token.tokenSymbol]

    // If not found, try case-insensitive match
    if (!price) {
      const upperSymbol = token.tokenSymbol.toUpperCase()
      for (const [symbol, value] of Object.entries(prices)) {
        if (symbol.toUpperCase() === upperSymbol) {
          price = value
          break
        }
      }
    }

    // If still not found, try to match by removing .e, .b suffixes
    if (!price) {
      const baseName = token.tokenSymbol.split(".")[0]
      price = prices[baseName]
    }

    // Default to 0 if no price found
    if (!price) {
      price = 0
    }

    const usdValue = token.formattedBalance * price
    totalUsdValue += usdValue

    return {
      ...token,
      usdValue,
    }
  })

  return {
    ...balances,
    tokens: updatedTokens,
    totalUsdValue,
  }
}

// Update buyback token balances with USD values
export function updateBuybackTokensWithPrices(
  tokens: BuybackTokenInfo[],
  prices: Record<string, number>,
): BuybackTokenInfo[] {
  return tokens.map((token) => {
    // Try to find price by exact symbol match
    let price = prices[token.tokenSymbol]

    // If not found, try case-insensitive match
    if (!price) {
      const upperSymbol = token.tokenSymbol.toUpperCase()
      for (const [symbol, value] of Object.entries(prices)) {
        if (symbol.toUpperCase() === upperSymbol) {
          price = value
          break
        }
      }
    }

    // If still not found, try to match by removing .e, .b suffixes
    if (!price) {
      const baseName = token.tokenSymbol.split(".")[0]
      price = prices[baseName]
    }

    // Default to 0 if no price found
    if (!price) {
      price = 0
    }

    const usdValue = token.formattedBalance * price

    return {
      ...token,
      usdValue,
    }
  })
}

// Get combined token balances
export function getCombinedTokenBalances(
  arbBalances: ContractTokenBalances,
  avaxBalances: ContractTokenBalances,
): { totalUsdValue: number; tokenCount: number } {
  const totalUsdValue = arbBalances.totalUsdValue + avaxBalances.totalUsdValue
  const tokenCount = arbBalances.tokens.length + avaxBalances.tokens.length

  return {
    totalUsdValue,
    tokenCount,
  }
}

// Fetch GMX price from CoinGecko
export async function fetchGMXPrice(): Promise<number> {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=gmx&vs_currencies=usd", {
      cache: "no-store",
    })
    const data = await response.json()
    return data.gmx?.usd || 12.0 // Fallback price
  } catch (error) {
    console.error("Error fetching GMX price:", error)
    return 12.0 // Fallback price
  }
}

// Get outflow transactions (where contract is the sender)
export function getOutflowTransactions(transactions: TokenTransaction[]): TokenTransaction[] {
  return transactions.filter(
    (tx) =>
      tx.from.toLowerCase() === ARBITRUM_CONTRACT.toLowerCase() ||
      tx.from.toLowerCase() === AVALANCHE_CONTRACT.toLowerCase(),
  )
}

// Calculate USD value
export function calculateUsdValue(balance: number, price: number): number {
  return balance * price
}

// List of common token symbols to display in the overview
const COMMON_TOKEN_SYMBOLS = new Set([
  "GMX",
  "WETH",
  "ETH",
  "WBTC",
  "BTC",
  "BTC.B",
  "BTCB",
  "WBTC.E",
  "USDC",
  "USDC.E",
  "USDT",
  "DAI",
  "ARB",
  "AVAX",
  "WAVAX",
  "LINK",
  "AAVE",
  "UNI",
  "PEPE",
  "WSTETH",
  "USDE",
  "TBTC",
])

// Get common tokens from all token balances
export function getCommonTokens(
  arbBalances: ContractTokenBalances,
  avaxBalances: ContractTokenBalances,
): (TokenInfo & { network: "arbitrum" | "avalanche" })[] {
  const arbTokens = arbBalances.tokens
    .filter((token) => COMMON_TOKEN_SYMBOLS.has(token.tokenSymbol))
    .map((token) => ({ ...token, network: "arbitrum" as const }))

  const avaxTokens = avaxBalances.tokens
    .filter((token) => COMMON_TOKEN_SYMBOLS.has(token.tokenSymbol))
    .map((token) => ({ ...token, network: "avalanche" as const }))

  return [...arbTokens, ...avaxTokens]
}
