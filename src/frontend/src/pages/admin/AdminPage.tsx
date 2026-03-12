import { AdminDashboard } from "../../components/admin/AdminDashboard";
import { AdminGate } from "../../components/admin/AdminGate";

export function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  );
}
