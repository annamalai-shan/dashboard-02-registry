import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconCurrencyDollar,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Accent = "violet" | "blue" | "amber" | "rose"

const accentMap: Record<Accent, { strip: string; icon: string }> = {
  violet: { strip: "border-t-violet-500", icon: "text-violet-600 dark:text-violet-400" },
  blue: { strip: "border-t-blue-500", icon: "text-blue-600 dark:text-blue-400" },
  amber: { strip: "border-t-amber-500", icon: "text-amber-600 dark:text-amber-400" },
  rose: { strip: "border-t-rose-500", icon: "text-rose-600 dark:text-rose-400" },
}

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  footerText: string
  accent: Accent
  icon: React.ReactNode
}

function StatCard({
  title,
  value,
  change,
  trend,
  description,
  footerText,
  accent,
  icon,
}: StatCardProps) {
  const a = accentMap[accent]
  return (
    <Card className={cn("@container/card border-t-4", a.strip)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={cn(
              "gap-1",
              trend === "up"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
            {change}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          <span className={cn("[&_svg]:size-4", a.icon)}>{icon}</span>
          {footerText}
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
    accent: "violet",
    icon: <IconCurrencyDollar />,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    footerText: "Strong user growth",
    description: "+573 from last month",
    accent: "blue",
    icon: <IconUsers />,
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "-2.3%",
    trend: "down",
    footerText: "Slightly below target",
    description: "Optimize onboarding flow",
    accent: "amber",
    icon: <IconArrowUpRight />,
  },
  {
    title: "Error Rate",
    value: "0.12%",
    change: "-0.05%",
    trend: "down",
    footerText: "Errors within threshold",
    description: "Monitored over the last 7 days",
    accent: "rose",
    icon: <IconAlertTriangle />,
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
