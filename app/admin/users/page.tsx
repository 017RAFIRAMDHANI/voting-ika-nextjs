import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import AdminUserManager from "@/components/AdminUserManager";
import { getAdminUsers } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");
  const users = await getAdminUsers();
  return <AppShell user={user}><div className="container-xxl flex-grow-1 container-p-y"><h4 className="fw-bold py-3 mb-4">Kelola Akun Pengguna</h4><AdminUserManager users={users} currentUserId={user.id} /></div></AppShell>;
}
