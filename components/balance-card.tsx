import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkBadge } from "@/components/network-badge"
import type { TokenBalance } from "@/lib/api"

interface BalanceCardProps {
  balance: TokenBalance
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">GMX Balance</CardTitle>
          <NetworkBadge network={balance.network} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{balance.formattedBalance.toFixed(2)} GMX</p>
          <p className="text-muted-foreground">
            ${balance.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
