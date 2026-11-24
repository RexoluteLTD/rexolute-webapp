import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table"

export function TopPerformers() {
  const performers = [
    { name: "Taiwo Awoniyi", sessions: 20, performance: 98 },
    { name: "Grace Dully", sessions: 15, performance: 94 },
    { name: "Sivbe Nwonsofor", sessions: 13, performance: 90 },
    { name: "Joy Asuquo", sessions: 24, performance: 89 },
    { name: "Peace Emmanuel", sessions: 25, performance: 88 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top performing therapist</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>NO SESSION</TableHead>
              <TableHead>PERFORMANCE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performers.map((performer) => (
              <TableRow key={performer.name}>
                <TableCell>{performer.name}</TableCell>
                <TableCell>{performer.sessions}</TableCell>
                <TableCell className="text-green-600">{performer.performance}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
