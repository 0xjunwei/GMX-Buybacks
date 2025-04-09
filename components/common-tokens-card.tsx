import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NetworkBadge } from "@/components/network-badge"
import type { TokenInfo } from "@/lib/api"

interface CommonToken extends TokenInfo {
  network: "arbitrum" | "avalanche"
}

interface CommonTokensCardProps {
  tokens: CommonToken[]
}

export function CommonTokensCard({ tokens }: CommonTokensCardProps) {
  // Sort tokens by USD value
  const sortedTokens = [...tokens].sort((a, b) => b.usdValue - a.usdValue)

  // Calculate total USD value
  const totalUsdValue = sortedTokens.reduce((sum, token) => sum + token.usdValue, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Common Tokens</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: ${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTokens.map((token, index) => (
              <TableRow key={`${token.network}-${token.tokenAddress}-${index}`}>
                <TableCell>
                  <NetworkBadge network={token.network} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{token.tokenSymbol}</span>
                    <span className="text-xs text-muted-foreground">{token.tokenName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {token.formattedBalance.toLocaleString(undefined, {
                    maximumFractionDigits: token.formattedBalance < 0.01 ? 8 : 4,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  $
                  {token.usdValue > 0 && token.formattedBalance > 0
                    ? (token.usdValue / token.formattedBalance).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </TableCell>
                <TableCell className="text-right">
                  ${token.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
