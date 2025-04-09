import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PriceCardProps {
  price: number
}

export function PriceCard({ price }: PriceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">GMX Price</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">${price.toFixed(2)} USD</p>
      </CardContent>
    </Card>
  )
}
