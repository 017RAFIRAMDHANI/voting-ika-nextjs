import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import VotingForm from "@/components/VotingForm";
import { getCandidates } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function VotingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.voterId) redirect("/biodata");

  if (user.hasVoted) {
    return (
      <AppShell user={user}>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="col-md-8">
              <div className="confirmation-card">
                <img src="/assets/img/logo.png" alt="Logo IKA" className="celebration-image" />
                <h1 className="mt-4">Terima Kasih</h1>
                <h3>Telah Berpartisipasi Dalam Pemilihan</h3>
                <Link href="/" className="gold-button mt-3">Kembali ke Halaman Utama</Link>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const candidates = await getCandidates();
  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4 text-warning fw-bold">Pemilihan Ketua IKA AN/AP</h1>
            <p className="text-muted">Pilih Pemimpin Anda</p>
          </div>
          <VotingForm candidates={candidates} />
        </div>
      </div>
    </AppShell>
  );
}
