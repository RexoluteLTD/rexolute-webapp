import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"
import { Progress } from "@rexolute/ui/progress"

export function SessionBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Completed Sessions</div>
            <div className="flex items-center gap-2">
              <div className="font-medium">828</div>
              <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">84%</div>
            </div>
          </div>
          <Progress value={84} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />

          <div className="flex items-center justify-between">
            <div className="font-medium">Upcoming Sessions</div>
            <div className="flex items-center gap-2">
              <div className="font-medium">138</div>
              <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-600">14%</div>
            </div>
          </div>
          <Progress value={14} className="h-2 bg-amber-100" indicatorClassName="bg-amber-500" />

          <div className="flex items-center justify-between">
            <div className="font-medium">Reassigned Sessions</div>
            <div className="flex items-center gap-2">
              <div className="font-medium">19</div>
              <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">2%</div>
            </div>
          </div>
          <Progress value={2} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />

          <div className="flex items-center justify-between">
            <div className="font-medium">Rescheduled Sessions</div>
            <div className="flex items-center gap-2">
              <div className="font-medium">19</div>
              <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">4%</div>
            </div>
          </div>
          <Progress value={4} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>
      </CardContent>
    </Card>
  )
}
