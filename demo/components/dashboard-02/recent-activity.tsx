import {
  IconCreditCard,
  IconUserPlus,
  IconAlertTriangle,
  IconCircleCheckFilled,
  IconMail,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ActivityItem {
  id: number
  user: { name: string; avatar?: string }
  action: string
  target: string
  time: string
  icon: React.ReactNode
}

const activities: ActivityItem[] = [
  {
    id: 1,
    user: { name: "Olivia Martin", avatar: "/avatars/01.png" },
    action: "upgraded to",
    target: "Pro plan",
    time: "2 min ago",
    icon: <IconCreditCard className="size-4 text-green-500" />,
  },
  {
    id: 2,
    user: { name: "Jackson Lee" },
    action: "signed up via",
    target: "invite link",
    time: "12 min ago",
    icon: <IconUserPlus className="size-4 text-blue-500" />,
  },
  {
    id: 3,
    user: { name: "System" },
    action: "detected",
    target: "API latency spike",
    time: "34 min ago",
    icon: <IconAlertTriangle className="size-4 text-yellow-500" />,
  },
  {
    id: 4,
    user: { name: "Sofia Davis", avatar: "/avatars/03.png" },
    action: "completed",
    target: "onboarding",
    time: "1 hr ago",
    icon: <IconCircleCheckFilled className="size-4 fill-green-500" />,
  },
  {
    id: 5,
    user: { name: "William Kim" },
    action: "requested",
    target: "invoice #1042",
    time: "2 hr ago",
    icon: <IconMail className="size-4 text-muted-foreground" />,
  },
]

export function RecentActivity() {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events across your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="-mx-2 flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60"
            >
              <Avatar className="size-8">
                {activity.user.avatar && (
                  <AvatarImage
                    src={activity.user.avatar}
                    alt={activity.user.name}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {activity.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="flex size-5 items-center justify-center rounded-md bg-muted">
                    {activity.icon}
                  </span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
