import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getAdminStats } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

const cards = [
  { key: "users", label: "Total Akun", icon: "bx-group", color: "primary" },
  { key: "voters", label: "Biodata Pemilih", icon: "bx-id-card", color: "info" },
  { key: "voted", label: "Sudah Memilih", icon: "bx-check-circle", color: "success" },
  { key: "candidates", label: "Total Calon", icon: "bx-user-pin", color: "warning" },
  { key: "totalVotes", label: "Total Suara", icon: "bx-bar-chart-alt-2", color: "danger" }
] as const;

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) redirect("/admin/login");
  const stats = await getAdminStats();
  return <AppShell user={user}><div className="container-xxl flex-grow-1 container-p-y"><h4 className="fw-bold py-3 mb-4">Dashboard Administrator</h4><div className="row g-4 mb-4">
    {cards.map((card) => <div className="col-md-6 col-xl" key={card.key}><div className="card h-100"><div className="card-body"><div className={`avatar flex-shrink-0 mb-3 bg-label-${card.color} rounded`}><i className={`bx ${card.icon} fs-3`} /></div><h3 className="mb-1">{stats[card.key]}</h3><span className="text-muted">{card.label}</span></div></div></div>)}
  </div><div className="card"><h5 className="card-header">Menu Pengelolaan</h5><div className="card-body"><div className="row g-3"><AdminLink href="/calonketua" icon="bx-user-pin" title="Kelola Calon" text="Tambah, edit, dan hapus kandidat." /><AdminLink href="/admin/users" icon="bx-group" title="Kelola Akun" text="Akun, peran, password, dan reset hak pilih." /><AdminLink href="/datapemilih" icon="bx-data" title="Data Pemilih" text="Cari, edit biodata, detail, dan ekspor." /><AdminLink href="/hasil" icon="bx-bar-chart" title="Hasil Suara" text="Lihat kartu kandidat dan grafik suara." /><AdminLink href="/excel" icon="bx-import" title="Import Excel" text="Impor akun pemilih secara massal." /></div></div></div></div></AppShell>;
}

function AdminLink({ href, icon, title, text }: { href: string; icon: string; title: string; text: string }) {
  return <div className="col-md-6 col-lg-4"><Link href={href} className="card border h-100 text-decoration-none"><div className="card-body"><i className={`bx ${icon} fs-2 text-primary mb-2`} /><h5>{title}</h5><p className="text-muted mb-0">{text}</p></div></Link></div>;
}
