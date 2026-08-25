import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import ResultsChart from "@/components/ResultsChart";
import { getCandidates } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");
  const candidates = await getCandidates();

  return (
    <AppShell user={user}>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-4 text-primary fw-bold">Hasil Rekapitulasi Suara</h1>
        </div>
        <div className="row gy-4">
          {candidates.map((candidate) => (
            <div className="col-md-6 col-lg-4" key={candidate.id}>
              <div className="card shadow-lg border-0">
                <img src={mediaUrl(candidate.image)} className="card-img-top rounded" alt={`Foto ${candidate.name}`} />
                <div className="card-body text-center">
                  <h3 className="card-title text-dark fw-bold">{candidate.name}</h3>
                  <p className="text-muted">Perolehan Suara: <span className="text-success fw-bold">{candidate.votes} Suara</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="my-5">
          <h2 className="text-center fw-bold mb-4">Perbandingan Suara Kandidat</h2>
          <ResultsChart candidates={candidates} />
        </div>
      </div>
    </AppShell>
  );
}
