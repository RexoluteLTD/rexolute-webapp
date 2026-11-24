import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"


export function SessionTypeBreakdown() {
  const sessionTypes = [
    {
      type: "Myself",
      percentage: 70,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      type: "Myself and my partner",
      percentage: 26,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      type: "A child",
      percentage: 4,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Therapy session type breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sessionTypes.map((session) => (
            <Card key={session.type} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <img
                  src={session.avatar || "/placeholder.svg"}
                  width={40}
                  height={40}
                  alt={session.type}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="text-sm">{session.type}</div>
                </div>
                <div className="text-green-600 font-medium">{session.percentage}%</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
