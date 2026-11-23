

import { Card, CardContent, CardHeader, CardTitle } from "@rexolute/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rexolute/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", student: 30, nonStudent: 20 },
  { name: "Feb", student: 35, nonStudent: 25 },
  { name: "Mar", student: 40, nonStudent: 30 },
  { name: "Apr", student: 45, nonStudent: 35 },
  { name: "May", student: 50, nonStudent: 40 },
  { name: "Jun", student: 55, nonStudent: 45 },
  { name: "Jul", student: 60, nonStudent: 50 },
  { name: "Aug", student: 65, nonStudent: 55 },
  { name: "Sep", student: 70, nonStudent: 60 },
  { name: "Oct", student: 75, nonStudent: 65 },
  { name: "Nov", student: 80, nonStudent: 70 },
  { name: "Dec", student: 85, nonStudent: 75 },
]

export function UserSignupChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="12months">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="12months">12 months</TabsTrigger>
            <TabsTrigger value="3months">3 months</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
            <TabsTrigger value="7days">7 days</TabsTrigger>
          </TabsList>
          <TabsContent value="12months" className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="student"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Student sign-up"
                />
                <Line
                  type="monotone"
                  dataKey="nonStudent"
                  stroke="#86efac"
                  strokeWidth={2}
                  dot={false}
                  name="Non student sign-up"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
                <span className="text-sm">Student sign-up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-300"></div>
                <span className="text-sm">Non student sign-up</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="3months">{/* Similar content for 3 months */}</TabsContent>
          <TabsContent value="30days">{/* Similar content for 30 days */}</TabsContent>
          <TabsContent value="7days">{/* Similar content for 7 days */}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
