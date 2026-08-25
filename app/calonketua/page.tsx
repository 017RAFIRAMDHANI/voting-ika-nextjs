import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import CandidateManager from "@/components/CandidateManager";
import { getCandidates } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");
  const candidates = await getCandidates();

  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4">Kelola Calon Ketua IKA AN/AP</h4>
        <CandidateManager candidates={candidates} />
      </div>
    </AppShell>
  );
}
