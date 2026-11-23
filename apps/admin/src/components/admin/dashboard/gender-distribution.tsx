import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"

export function GenderDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users distribution by Gender</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>Male</div>
            <div className="font-medium">38%</div>
          </div>
          <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "38%" }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>Female</div>
            <div className="font-medium">62%</div>
          </div>
          <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "62%" }}></div>
          </div>
        </div>

        <CardTitle className="pt-4">Therapist distribution by Gender</CardTitle>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>Male</div>
            <div className="font-medium">38%</div>
          </div>
          <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "38%" }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>Female</div>
            <div className="font-medium">62%</div>
          </div>
          <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "62%" }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
