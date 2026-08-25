import Link from "next/link";
import AppShell from "@/components/AppShell";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row">
          <div className="col-xxl">
            <div className="card mb-4 dashboard-card">
              <div className="container mt-5">
                <div className="dashboard-image">
                  <img src="/assets/img/ika.png" alt="IKA AN/AP FISIP UNPAD" className="img-fluid" />
                </div>
                <div className="dashboard-text">
                  <p>Selamat Datang di Portal Pemilihan Ketua IKA AN/AP FISIP UNPAD 2024!</p>
                  <Link href="/pemilihan" className="dashboard-button">
                    Mulai Pemilihan <i className="bx bx-pin mx-1" />
                  </Link>
                </div>
              </div>
              <div className="card-body" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
