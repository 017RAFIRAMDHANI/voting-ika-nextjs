"use client";

import { useState, type FormEvent } from "react";
import LoadingButton from "@/components/LoadingButton";
import { mediaUrl } from "@/lib/media";
import type { Candidate } from "@/lib/types";

function CandidateContent({ candidate }: { candidate: Candidate }) {
  const visionIsImage = candidate.vision.startsWith("/") || candidate.vision.startsWith("data:image/");
  const missionIsImage = candidate.mission.startsWith("/") || candidate.mission.startsWith("data:image/");
  const programIsImage = candidate.featuredProgram.startsWith("/") || candidate.featuredProgram.startsWith("data:image/");
  return (
    <div className="card-body">
      <h3 className="card-title text-center">{candidate.name}</h3>
      <p className="text-muted text-center">&quot;Angkatan {candidate.cohort}&quot;</p>
      <hr />
      <h5 className="text-primary fw-bold mb-1">Pekerjaan</h5>
      <p className="text-muted text-center candidate-copy">{candidate.occupation}</p>
      <hr />
      <h5 className="text-primary fw-bold">Visi</h5>
      {visionIsImage ? (
        <img src={mediaUrl(candidate.vision)} alt="Visi kandidat" className="candidate-visual mb-3" />
      ) : (
        <p className="text-muted candidate-copy">{candidate.vision}</p>
      )}
      <h5 className="text-primary fw-bold">Misi</h5>
      {missionIsImage ? (
        <>
          <img src={mediaUrl(candidate.mission)} alt="Misi kandidat" className="candidate-visual" />
          <img src="/storage/img/tagline.png" alt="Tagline kandidat" className="candidate-visual my-3" />
        </>
      ) : (
        <p className="text-muted candidate-copy">{candidate.mission}</p>
      )}
      <h5 className="text-primary fw-bold">Program Unggulan</h5>
      {programIsImage ? (
        <img src={mediaUrl(candidate.featuredProgram)} alt="Program unggulan kandidat" className="candidate-visual" />
      ) : (
        <p className="text-muted candidate-copy">{candidate.featuredProgram}</p>
      )}
    </div>
  );
}

export default function VotingForm({ candidates }: { candidates: Candidate[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    if (!window.confirm("Simpan pilihan Anda? Pilihan tidak dapat diubah setelah dikirim.")) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ candidateId: selected })
      });
      const result = (await response.json().catch(() => ({
        ok: false,
        message: `Server mengembalikan respons yang tidak valid (${response.status}).`
      }))) as { ok: boolean; message?: string; redirectTo?: string };
      if (!response.ok) throw new Error(result.message || "Pilihan gagal disimpan.");
      window.location.replace(result.redirectTo || "/pemilihan");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pilihan gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form id="votingForm" onSubmit={submit} className="row g-4">
      {candidates.map((candidate) => (
        <div className="col-md-4" style={{ marginTop: 120 }} key={candidate.id}>
          <label className={`candidate-card shadow-lg ${selected === candidate.id ? "is-selected" : ""}`}>
            <input
              type="radio"
              name="candidate"
              value={candidate.id}
              className="candidate-radio"
              checked={selected === candidate.id}
              onChange={() => setSelected(candidate.id)}
            />
            <img src={mediaUrl(candidate.image)} alt={`Foto ${candidate.name}`} className="candidate-photo" />
            <CandidateContent candidate={candidate} />
          </label>
        </div>
      ))}
      <div className="col-12 text-center mt-4">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <LoadingButton busy={busy} id="submitVote" type="submit" className="vote-button" disabled={!selected}>
          Pilih Calon
        </LoadingButton>
      </div>
    </form>
  );
}
