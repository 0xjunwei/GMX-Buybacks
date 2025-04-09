"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NetworkBadge } from "@/components/network-badge"
import type { ContractTokenBalances } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface TokenBalancesTableProps {
  arbBalances: ContractTokenBalances
  avaxBalances: ContractTokenBalances
}

export function TokenBalancesTable({ arbBalances, avaxBalances }: TokenBalancesTableProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Combine and sort tokens by USD value
  const allTokens = [
    ...arbBalances.tokens.map((token) => ({ ...token, network: "arbitrum" as const })),
    ...avaxBalances.tokens.map((token) => ({ ...token, network: "avalanche" as const })),
  ].sort((a, b) => b.usdValue - a.usdValue)

  const totalPages = Math.ceil(allTokens.length / pageSize)
  const paginatedTokens = allTokens.slice((page - 1) * pageSize, page * pageSize)

  if (allTokens.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No tokens found</AlertTitle>
        <AlertDescription>
          We couldn't find any tokens in these contracts. This could be due to API limitations or rate limiting. Try
          refreshing the page or checking back later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Network</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">USD Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTokens.length > 0 ? (
            paginatedTokens.map((token, index) => (
              <TableRow key={`${token.network}-${token.tokenAddress}`}>
                <TableCell>
                  <NetworkBadge network={token.network} />
                </TableCell>
                <TableCell>{token.tokenName}</TableCell>
                <TableCell>{token.tokenSymbol}</TableCell>
                <TableCell className="text-right">
                  {token.formattedBalance.toLocaleString(undefined, {
                    maximumFractionDigits: token.formattedBalance < 0.01 ? 8 : 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  ${token.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No tokens found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
