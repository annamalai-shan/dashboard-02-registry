"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jul", revenue: 32400, target: 35000 },
  { month: "Aug", revenue: 35800, target: 35000 },
  { month: "Sep", revenue: 38200, target: 38000 },
  { month: "Oct", revenue: 41500, target: 40000 },
  { month: "Nov", revenue: 39800, target: 42000 },
  { month: "Dec", revenue: 45200, target: 43000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  target: {
    label: "Target",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRevenue() {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>Monthly Recurring Revenue</CardTitle>
        <CardDescription>Last 6 months vs target</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={4}
            />
            <Bar
              dataKey="target"
              fill="var(--color-target)"
              radius={4}
              fillOpacity={0.3}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
