import { z } from "zod";
import { saveBiodata } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { isSameOrigin, jsonError } from "@/lib/security";

const schema = z.object({
  name: z.string().trim().min(2, "Nama wajib diisi.").max(255),
  cohort: z
    .string()
    .regex(/^\d{4}$/, "Tahun angkatan tidak valid.")
    .refine((year) => Number(year) >= 1978 && Number(year) <= 2021, "Tahun angkatan tidak valid.")
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Permintaan tidak valid.", 403);
  const user = await getSessionUser();
  if (!user) return jsonError("Silakan login terlebih dahulu.", 401);
  if (user.voterId) return jsonError("Biodata sudah pernah diisi.", 409);

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Biodata tidak valid.");

  const saved = await saveBiodata(user.id, parsed.data.name, parsed.data.cohort);
  if (!saved) return jsonError("Biodata tidak dapat disimpan atau sudah pernah diisi.", 409);
  return Response.json({ ok: true, redirectTo: "/pemilihan" });
}
