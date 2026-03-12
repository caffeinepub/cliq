import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";

export function NotificationsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Management</CardTitle>
        <CardDescription>
          View and manage platform notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="py-12 text-center">
        <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          Notifications are managed per-user. Use the Users panel to view
          individual user notifications.
        </p>
      </CardContent>
    </Card>
  );
}
