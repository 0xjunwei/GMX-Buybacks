import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CombinedOverviewCardProps {
  totalUsdValue: number
  tokenCount: number
}

export function CombinedOverviewCard({ totalUsdValue, tokenCount }: CombinedOverviewCardProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Total Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold">${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p className="text-muted-foreground">{tokenCount} tokens across all networks</p>
        </div>
      </CardContent>
    </Card>
  )
}
