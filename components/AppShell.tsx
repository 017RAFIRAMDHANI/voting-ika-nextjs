"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/types";

function active(pathname: string, route: string) {
  return route === "/" ? pathname === "/" : pathname.startsWith(route);
}

export default function AppShell({
  user,
  children
}: {
  user: SessionUser | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = user?.role === "Admin";

  return (
    <main className="app-main">
      <div className={`layout-wrapper layout-content-navbar ${menuOpen ? "ika-menu-open" : ""}`}>
        <div className="layout-container">
          <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme ika-sidebar">
            <div className="app-brand demo ika-sidebar-brand">
              <Link href="/" className="app-brand-link" aria-label="Beranda">
                <img src="/assets/img/logo.png" alt="Logo IKA" style={{ width: 90 }} />
                <img src="/assets/img/logo2.png" alt="Logo AN/AP" style={{ width: 70 }} />
              </Link>
              <button
                type="button"
                className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none ika-topbar-button"
                onClick={() => setMenuOpen(false)}
                aria-label="Tutup menu"
              >
                <i className="bx bx-chevron-left bx-sm align-middle" />
              </button>
            </div>
            <div className="menu-inner-shadow" />
            <ul className="menu-inner py-1">
              <li className={`menu-item ${active(pathname, "/") ? "active" : ""}`}>
                <Link href="/" className="menu-link" onClick={() => setMenuOpen(false)}>
                  <i className="menu-icon tf-icons bx bx-home-circle" />
                  <div>Dashboard</div>
                </Link>
              </li>
              {admin && (
                <li className={`menu-item ${pathname === "/admin" ? "active" : ""}`}>
                  <Link href="/admin" className="menu-link" onClick={() => setMenuOpen(false)}>
                    <i className="menu-icon tf-icons bx bx-grid-alt" />
                    <span>Dashboard Admin</span>
                  </Link>
                </li>
              )}
              {admin && (
                <li className={`menu-item ${active(pathname, "/hasil") ? "active" : ""}`}>
                  <Link href="/hasil" className="menu-link" onClick={() => setMenuOpen(false)}>
                    <i className="menu-icon tf-icons bx bx-bar-chart" />
                    <span>Hasil Suara</span>
                  </Link>
                </li>
              )}
              {admin && (
                <li className={`menu-item ${active(pathname, "/calonketua") ? "active" : ""}`}>
                  <Link href="/calonketua" className="menu-link" onClick={() => setMenuOpen(false)}>
                    <i className="menu-icon tf-icons bx bx-user-pin" />
                    <div>Kelola Calon</div>
                  </Link>
                </li>
              )}
              <li className={`menu-item ${active(pathname, "/pemilihan") ? "active" : ""}`}>
                <Link href="/pemilihan" className="menu-link" onClick={() => setMenuOpen(false)}>
                  <i className="menu-icon tf-icons bx bx-check-square" />
                  <div>Pemilihan Ketua IKA</div>
                </Link>
              </li>
              {admin && (
                <li className={`menu-item ${active(pathname, "/datapemilih") ? "active" : ""}`}>
                  <Link href="/datapemilih" className="menu-link" onClick={() => setMenuOpen(false)}>
                    <i className="menu-icon tf-icons bx bx-data" />
                    <div>Data Pemilih</div>
                  </Link>
                </li>
              )}
              {admin && (
                <li className={`menu-item ${active(pathname, "/admin/users") ? "active" : ""}`}>
                  <Link href="/admin/users" className="menu-link" onClick={() => setMenuOpen(false)}>
                    <i className="menu-icon tf-icons bx bx-group" />
                    <div>Kelola Akun</div>
                  </Link>
                </li>
              )}
              {admin && (
                <li className={`menu-item ${active(pathname, "/excel") ? "active" : ""}`}>
                  <Link href="/excel" className="menu-link" onClick={() => setMenuOpen(false)}>
                    <i className="menu-icon tf-icons bx bx-import" />
                    <div>Import Excel</div>
                  </Link>
                </li>
              )}
            </ul>
          </aside>

          <div className="layout-page">
            <nav
              className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
              id="layout-navbar"
            >
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <button
                  type="button"
                  className="nav-item nav-link px-0 me-xl-4 ika-topbar-button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Buka menu"
                >
                  <i className="bx bx-menu bx-sm" />
                </button>
              </div>
              <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                <div className="navbar-nav align-items-center" />
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                  <li className="nav-item navbar-dropdown dropdown-user dropdown ika-profile-menu">
                    <details className="ika-profile-details">
                      <summary
                        className="nav-link dropdown-toggle hide-arrow ika-topbar-button ika-profile-summary"
                        aria-label="Menu pengguna"
                      >
                        <span className="avatar avatar-online">
                          <img src="/assets/img/logo.png" alt="" className="w-px-40 h-auto rounded-circle" />
                        </span>
                      </summary>
                      <ul className="dropdown-menu dropdown-menu-end ika-dropdown">
                        <li>
                          <div className="dropdown-item">
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <span className="avatar avatar-online">
                                  <img src="/assets/img/logo.png" alt="" className="w-px-40 h-auto rounded-circle" />
                                </span>
                              </div>
                              <div className="flex-grow-1">
                                <span className="fw-semibold d-block">{user?.displayName ?? "User"}</span>
                                <small className="text-muted">{user?.role ?? "Pengunjung"}</small>
                              </div>
                            </div>
                          </div>
                        </li>
                        {!user ? (
                          <li>
                            <Link className="dropdown-item" href="/login">
                              <i className="bx bx-log-in me-2" />
                              <span className="align-middle">Login</span>
                            </Link>
                          </li>
                        ) : (
                          <>
                            <li><div className="dropdown-divider" /></li>
                            <li>
                              <form action={`/api/auth/logout?target=${admin ? "admin" : "voter"}`} method="post">
                                <button type="submit" className="dropdown-item">
                                  <i className="bx bx-power-off me-2" />
                                  <span className="align-middle">Log Out</span>
                                </button>
                              </form>
                            </li>
                          </>
                        )}
                      </ul>
                    </details>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="content-wrapper">
              {children}
              <div className="content-backdrop fade" />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="layout-overlay layout-menu-toggle ika-layout-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Tutup menu"
        />
      </div>
    </main>
  );
}
