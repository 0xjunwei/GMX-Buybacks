import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TokenTransaction } from "@/lib/api"

interface TotalOutflowCardProps {
  transactions: TokenTransaction[]
  gmxPrice: number
}

export function TotalOutflowCard({ transactions, gmxPrice }: TotalOutflowCardProps) {
  const totalGmx = transactions.reduce((sum, tx) => sum + tx.formattedValue, 0)
  const totalUsd = totalGmx * gmxPrice

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Total GMX Outflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{totalGmx.toFixed(2)} GMX</p>
          <p className="text-muted-foreground">
            ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
