import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (isAdmin(user)) redirect("/admin");
  if (user) redirect(user.voterId ? "/pemilihan" : "/biodata");
  return (
    <div className="container d-flex justify-content-center align-items-center auth-shell">
      <div className="authentication-wrapper authentication-basic container-p-y auth-card">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a href="/login" className="app-brand-link gap-2">
                  <img src="/assets/img/logo.png" alt="Logo IKA" style={{ width: 100 }} />
                </a>
              </div>
              <div className="auth-copy">
                <p className="mb-4">*Masukan tahun angkatan, tanggal, bulan, dan tahun lahir sebagai User ID dan password (tanpa koma dan spasi).</p>
                <p className="mb-4">*Contoh: 19991261971 (1999 tahun angkatan, 1261971 kelahiran)</p>
                <p className="mb-4">*Pengisian User ID dan Password itu sama</p>
              </div>
              <LoginForm />
              <div className="text-center mt-3">
                <Link href="/admin/login">Login Administrator</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
