"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { VoterRecord } from "@/lib/types";

export default function VotersTable({ voters }: { voters: VoterRecord[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const needle = search.toLowerCase().trim();
    if (!needle) return voters;
    return voters.filter((voter) =>
      [voter.userId, voter.name, voter.cohort, voter.candidateName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle))
    );
  }, [search, voters]);

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3"><h5>Tabel Pemilih</h5></div>
          <div className="col-md-9" />
          <div className="col-md-3">
            <label className="visually-hidden" htmlFor="search">Cari Pemilih</label>
            <input
              type="text"
              id="search"
              className="form-control search-input"
              placeholder="Cari Pemilih..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <a href="/api/voters/export" className="btn btn-success mb-3">Export to Excel</a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="table-responsive text-nowrap">
          <table className="table">
            <thead>
              <tr className="text-nowrap">
                <th>#</th><th>User ID</th><th>Nama Pemilih</th><th>Tahun Angkatan</th><th>Calon Terpilih</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((voter, index) => (
                <tr key={voter.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{voter.userId}</td>
                  <td>{voter.name}</td>
                  <td>{voter.cohort}</td>
                  <td>{voter.candidateName ?? <i style={{ color: "red" }}>belum melakukan voting</i>}</td>
                  <td>
                    <Link href={`/datapemilih/${voter.id}`} className="badge bg-info" aria-label={`Lihat ${voter.name}`}>
                      <i className="bx bx-show" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Data pemilih tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
