import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import VotersTable from "@/components/VotersTable";
import { getVoters } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function VotersPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");
  const voters = await getVoters();

  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4">Data Pemilih</h4>
        <div className="card">
          <VotersTable voters={voters} />
        </div>
      </div>
    </AppShell>
  );
}
