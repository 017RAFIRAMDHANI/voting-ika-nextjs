"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-xxl container-p-y text-center py-5">
      <img src="/assets/img/illustrations/page-misc-error-light.png" alt="Terjadi gangguan" style={{ maxWidth: 420, width: "100%" }} />
      <h2 className="mt-4">Aplikasi belum dapat memuat data</h2>
      <p className="text-muted">Periksa koneksi Neon dan variabel lingkungan, lalu coba kembali.</p>
      <button type="button" className="btn btn-primary" onClick={reset}>Coba Lagi</button>
    </div>
  );
}
