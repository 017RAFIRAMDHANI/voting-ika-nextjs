import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import ImportUsersForm from "@/components/ImportUsersForm";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ExcelImportPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");

  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card p-4">
          <h4 className="mb-4">Import Data Pengguna</h4>
          <ImportUsersForm />
        </div>
      </div>
    </AppShell>
  );
}
