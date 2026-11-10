import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"

export function OtherStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground uppercase mb-2">No of user feedback</div>
              <div className="text-xs text-muted-foreground mb-4">USERS REVIEWS</div>
              <div className="text-2xl font-bold text-green-600">780</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground uppercase mb-2">Overall users satisfaction</div>
              <div className="text-xs text-muted-foreground mb-4">BASED ON USERS FEEDBACK</div>
              <div className="text-2xl font-bold text-green-600">92%</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground uppercase mb-2">User average session</div>
              <div className="text-xs text-muted-foreground mb-4">SESSION AVERAGE</div>
              <div className="text-2xl font-bold text-green-600">2.0</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground uppercase mb-2">Therapist average session</div>
              <div className="text-xs text-muted-foreground mb-4">BASED ON USERS FEEDBACK</div>
              <div className="text-2xl font-bold text-green-600">92%</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
