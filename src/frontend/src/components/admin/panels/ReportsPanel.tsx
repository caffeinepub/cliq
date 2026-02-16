import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function ReportsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Management</CardTitle>
        <CardDescription>View and manage user reports</CardDescription>
      </CardHeader>
      <CardContent className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          Reports functionality is not currently available in the backend. This feature can be added in a future update.
        </p>
      </CardContent>
    </Card>
  );
}
