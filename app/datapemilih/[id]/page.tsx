import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import VoterEditForm from "@/components/VoterEditForm";
import { getVoter } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function VoterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");
  const { id } = await params;
  const voterId = Number(id);
  if (!Number.isInteger(voterId) || voterId <= 0) notFound();
  const voter = await getVoter(voterId);
  if (!voter) notFound();

  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4">Data Lengkap Pemilih</h4>
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-pills flex-column flex-md-row mb-3">
              <li className="nav-item"><span className="nav-link active"><i className="bx bx-user me-1" /> Detail Data</span></li>
            </ul>
            <div className="card mb-4 detail-card">
              <h5 className="card-header">Profile Details</h5>
              <hr className="my-0" />
              <div className="card-body">
                <VoterEditForm voter={voter} />
              </div>
            </div>
            <Link className="btn btn-primary active" href="/datapemilih">Kembali</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
