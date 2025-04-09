"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NetworkBadge } from "@/components/network-badge"
import type { TokenTransaction } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

interface TransactionTableProps {
  transactions: TokenTransaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Sort transactions by timestamp (latest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => Number.parseInt(b.timeStamp) - Number.parseInt(a.timeStamp),
  )

  const totalPages = Math.ceil(sortedTransactions.length / pageSize)
  const paginatedTransactions = sortedTransactions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell>
                  {formatDistanceToNow(new Date(Number.parseInt(tx.timeStamp) * 1000), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <NetworkBadge network={tx.network} />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <a
                    href={`https://${tx.network === "arbitrum" ? "arbiscan.io" : "snowscan.xyz"}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}
                  </a>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <a
                    href={`https://${tx.network === "arbitrum" ? "arbiscan.io" : "snowscan.xyz"}/address/${tx.to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {tx.to.substring(0, 8)}...{tx.to.substring(tx.to.length - 6)}
                  </a>
                </TableCell>
                <TableCell className="text-right">{tx.formattedValue.toFixed(2)} GMX</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No transactions found
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
