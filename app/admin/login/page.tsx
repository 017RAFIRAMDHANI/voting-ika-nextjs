import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (isAdmin(user)) redirect("/admin");

  return (
    <div className="container d-flex justify-content-center align-items-center auth-shell">
      <div className="authentication-wrapper authentication-basic container-p-y auth-card">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center mb-4">
                <Link href="/admin/login" className="app-brand-link gap-2">
                  <img src="/assets/img/logo.png" alt="Logo IKA" style={{ width: 100 }} />
                </Link>
              </div>
              <div className="text-center mb-4">
                <h4 className="mb-2">Login Administrator</h4>
                <p className="text-muted mb-0">Masuk untuk mengelola kandidat, akun, pemilih, dan hasil suara.</p>
              </div>
              <AdminLoginForm />
              <div className="text-center mt-3">
                <Link href="/login">Login Pemilih</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
