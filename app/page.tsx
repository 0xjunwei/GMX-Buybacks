"use client"

import { useEffect, useState } from "react"
import { fetchAllData, fetchAllTokenBalances } from "./actions"
import type { TokenTransaction, TokenBalance, ContractTokenBalances, TokenInfo, BuybackTokenInfo } from "@/lib/api"
import { BalanceCard } from "@/components/balance-card"
import { TotalOutflowCard } from "@/components/total-outflow-card"
import { PriceCard } from "@/components/price-card"
import { TransactionTable } from "@/components/transaction-table"
import { RefreshButton } from "@/components/refresh-button"
import { AllTokensCard } from "@/components/all-tokens-card"
import { CombinedOverviewCard } from "@/components/combined-overview-card"
import { TokenBalancesTable } from "@/components/token-balances-table"
import { CommonTokensCard } from "@/components/common-tokens-card"
import { BuybackInfoCard } from "@/components/buyback-info-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CommonToken extends TokenInfo {
  network: "arbitrum" | "avalanche"
}

export default function Dashboard() {
  const [outflowTransactions, setOutflowTransactions] = useState<TokenTransaction[]>([])
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [gmxPrice, setGmxPrice] = useState(0)
  const [arbTokenBalances, setArbTokenBalances] = useState<ContractTokenBalances | null>(null)
  const [avaxTokenBalances, setAvaxTokenBalances] = useState<ContractTokenBalances | null>(null)
  const [combinedOverview, setCombinedOverview] = useState<{ totalUsdValue: number; tokenCount: number } | null>(null)
  const [commonTokens, setCommonTokens] = useState<CommonToken[]>([])
  const [buybackTokens, setBuybackTokens] = useState<BuybackTokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch data in parallel
      const [basicData, allTokensData] = await Promise.all([fetchAllData(), fetchAllTokenBalances()])

      // Update state with fetched data
      setOutflowTransactions(basicData.outflowTransactions)
      setBalances(basicData.balances)
      setGmxPrice(basicData.gmxPrice)
      setArbTokenBalances(allTokensData.arbitrum)
      setAvaxTokenBalances(allTokensData.avalanche)
      setCombinedOverview(allTokensData.combined)
      setCommonTokens(allTokensData.commonTokens || [])
      setBuybackTokens(allTokensData.buybackTokens || [])
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate total portfolio value from common tokens as a backup
  const commonTokensTotal = commonTokens.reduce((sum, token) => sum + token.usdValue, 0)

  // Calculate total buyback value
  const buybackTokensTotal = buybackTokens.reduce((sum, token) => sum + token.usdValue, 0)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">GMX Buyback Tracker</h1>
        <RefreshButton onRefresh={loadData} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="buyback">Buyback Tokens</TabsTrigger>
            <TabsTrigger value="gmx">GMX Tracking</TabsTrigger>
            <TabsTrigger value="all-tokens">All Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Combined Overview */}
            <div className="mb-8">
              {combinedOverview && (
                <CombinedOverviewCard
                  totalUsdValue={combinedOverview.totalUsdValue || commonTokensTotal}
                  tokenCount={combinedOverview.tokenCount}
                />
              )}
            </div>

            {/* Common Tokens */}
            <div className="mb-8">
              <CommonTokensCard tokens={commonTokens} />
            </div>

            {/* Network Specific Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {arbTokenBalances && <AllTokensCard balances={arbTokenBalances} />}
              {avaxTokenBalances && <AllTokensCard balances={avaxTokenBalances} />}
            </div>

            {/* GMX Price */}
            <div className="mb-8">
              <PriceCard price={gmxPrice} />
            </div>

            {/* Recent Transactions */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-4">Recent GMX Outflow Transactions</h2>
              <TransactionTable transactions={outflowTransactions.slice(0, 5)} />
            </div>
          </TabsContent>

          <TabsContent value="buyback">
            {/* Buyback Tokens */}
            <div className="mb-8">
              <BuybackInfoCard tokens={buybackTokens} />
            </div>
          </TabsContent>

          <TabsContent value="gmx">
            {/* GMX Specific Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {balances.map((balance, index) => (
                <BalanceCard key={index} balance={balance} />
              ))}
              <PriceCard price={gmxPrice} />
            </div>

            <div className="mb-8">
              <TotalOutflowCard transactions={outflowTransactions} gmxPrice={gmxPrice} />
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-4">GMX Outflow Transactions</h2>
              <TransactionTable transactions={outflowTransactions} />
            </div>
          </TabsContent>

          <TabsContent value="all-tokens">
            {/* All Tokens Table */}
            {arbTokenBalances && avaxTokenBalances && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-4">All Token Holdings</h2>
                <TokenBalancesTable arbBalances={arbTokenBalances} avaxBalances={avaxTokenBalances} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
