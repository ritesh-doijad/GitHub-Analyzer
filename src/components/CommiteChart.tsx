import { CommitData } from "../GitHub.Interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
  } from "recharts"
  


interface CommitChartProps {
  commitData: CommitData[]
}

export function CommitChart({ commitData }: CommitChartProps) {
  if (commitData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commit Activity</CardTitle>
          <CardDescription>Recent commit activity from public events</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No commit data available</p>
        </CardContent>
      </Card>
    )
  }

  // Format dates for display
  const formattedData = commitData.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>Recent commit activity (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickMargin={8}
                interval={Math.ceil(formattedData.length / 10)}
              />
              <YAxis tick={{ fontSize: 12 }} tickMargin={8} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-md">
                        <p className="font-medium">{payload[0].payload.formattedDate}</p>
                        <p className="font-bold">{`${payload[0].value} commits`}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="commits"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={Math.max(10, Math.min(30, 800 / formattedData.length))}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

