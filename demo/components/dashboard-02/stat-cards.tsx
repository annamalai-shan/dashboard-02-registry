import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconCurrencyDollar,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  footerText: string
  icon: React.ReactNode
}

function StatCard({
  title,
  value,
  change,
  trend,
  description,
  footerText,
  icon,
}: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
            {change}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerText} {icon}
        </div>
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  )
}

const stats: StatCardProps[] = [
  {
    title: "Monthly Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    footerText: "Revenue up from last month",
    description: "Based on the last 30 days",
    icon: <IconCurrencyDollar className="size-4" />,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    footerText: "Strong user growth",
    description: "+573 from last month",
    icon: <IconUsers className="size-4" />,
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "-2.3%",
    trend: "down",
    footerText: "Slightly below target",
    description: "Optimize onboarding flow",
    icon: <IconArrowUpRight className="size-4" />,
  },
  {
    title: "Error Rate",
    value: "0.12%",
    change: "-0.05%",
    trend: "down",
    footerText: "Errors within threshold",
    description: "Monitored over the last 7 days",
    icon: <IconAlertTriangle className="size-4" />,
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
