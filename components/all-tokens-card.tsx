import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkBadge } from "@/components/network-badge"
import type { ContractTokenBalances } from "@/lib/api"

interface AllTokensCardProps {
  balances: ContractTokenBalances
}

export function AllTokensCard({ balances }: AllTokensCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">All Token Holdings</CardTitle>
          <NetworkBadge network={balances.network} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold">
            ${balances.totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-muted-foreground">{balances.tokens.length} tokens</p>
        </div>
      </CardContent>
    </Card>
  )
}
