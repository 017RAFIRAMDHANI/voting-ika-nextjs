import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-xxl container-p-y text-center py-5">
      <img src="/assets/img/illustrations/page-misc-error-light.png" alt="Halaman tidak ditemukan" style={{ maxWidth: 420, width: "100%" }} />
      <h2 className="mt-4">Halaman tidak ditemukan</h2>
      <Link className="btn btn-primary mt-3" href="/">Kembali ke Dashboard</Link>
    </div>
  );
}
