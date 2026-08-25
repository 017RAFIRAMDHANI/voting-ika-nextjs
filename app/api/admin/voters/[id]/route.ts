import { z } from "zod";
import { updateVoter } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";
import { isSameOrigin, jsonError } from "@/lib/security";

const schema = z.object({
  name: z.string().trim().min(2).max(255),
  cohort: z.string().regex(/^\d{4}$/)
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return jsonError("Permintaan tidak valid.", 403);
  const session = await getSessionUser();
  if (!isAdmin(session)) return jsonError("Akses ditolak.", 403);
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return jsonError("ID pemilih tidak valid.");
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Nama atau tahun angkatan tidak valid.");
  const updated = await updateVoter(id, parsed.data.name, parsed.data.cohort);
  if (!updated) return jsonError("Pemilih tidak ditemukan.", 404);
  return Response.json({ ok: true });
}
