import { Badge } from "@/components/ui/badge"

interface NetworkBadgeProps {
  network: "arbitrum" | "avalanche"
}

export function NetworkBadge({ network }: NetworkBadgeProps) {
  if (network === "arbitrum") {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        Arbitrum
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
      Avalanche
    </Badge>
  )
}
