import { AdminGate } from '../../components/admin/AdminGate';
import { AdminDashboard } from '../../components/admin/AdminDashboard';

export function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  );
}
