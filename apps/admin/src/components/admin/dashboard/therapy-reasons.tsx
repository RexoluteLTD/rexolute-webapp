import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"
import { Progress } from "@rexolute/ui/progress"

export function TherapyReasons() {
  const reasons = [
    { name: "Relationship issues", percentage: 42 },
    { name: "Anxiety", percentage: 32 },
    { name: "Trauma", percentage: 23 },
    { name: "Substance abuse", percentage: 18 },
    { name: "Self esteem issue", percentage: 12 },
    { name: "Healthy problems", percentage: 8 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top reasons users seek therapy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reasons.map((reason) => (
          <div key={reason.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>{reason.name}</div>
              <div className="font-medium text-green-600">{reason.percentage}%</div>
            </div>
            <Progress value={reason.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
