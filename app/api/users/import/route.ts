import bcrypt from "bcryptjs";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import { getSessionUser, isAdmin } from "@/lib/session";
import { importUsers } from "@/lib/db";
import { isSameOrigin, jsonError } from "@/lib/security";

function valueToString(value: ExcelJS.CellValue) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") return value.text.trim();
    if ("result" in value && value.result !== undefined) return String(value.result).trim();
  }
  return String(value).trim();
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Permintaan tidak valid.", 403);
  const session = await getSessionUser();
  if (!isAdmin(session)) return jsonError("Akses ditolak.", 403);

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return jsonError("Pilih file Excel terlebih dahulu.");
  if (file.size > 4 * 1024 * 1024) return jsonError("Ukuran file maksimal 4 MB.");

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["xlsx", "csv"].includes(extension)) {
    return jsonError("Format yang didukung adalah .xlsx dan .csv.");
  }

  const workbook = new ExcelJS.Workbook();
  const buffer = Buffer.from(await file.arrayBuffer());
  if (extension === "csv") {
    await workbook.csv.read(Readable.from(buffer));
  } else {
    await workbook.xlsx.load(buffer as never);
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return jsonError("Lembar kerja tidak ditemukan.");

  const rawRecords: Array<{ userId: string; displayName: string }> = [];
  for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const userId = valueToString(row.getCell(11).value);
    const displayName = valueToString(row.getCell(5).value);
    if (!userId || !displayName) continue;
    if (rowNumber === 1) continue; // Abaikan baris pertama karena biasanya header
    rawRecords.push({ userId, displayName });
  }

  const uniqueRecords = Array.from(
    new Map(rawRecords.map((record) => [record.userId, record])).values()
  );
  if (uniqueRecords.length === 0) return jsonError("Tidak ada data pengguna yang dapat diimpor.");
  if (uniqueRecords.length > 5000) return jsonError("Maksimal 5.000 akun per impor.");

  const records: Array<{ userId: string; displayName: string; passwordHash: string }> = [];
  for (let index = 0; index < uniqueRecords.length; index += 25) {
    const batch = uniqueRecords.slice(index, index + 25);
    records.push(
      ...(await Promise.all(
        batch.map(async (record) => ({
          ...record,
          passwordHash: await bcrypt.hash(record.userId, 10)
        }))
      ))
    );
  }

  const imported = await importUsers(records);
  return Response.json({ ok: true, imported });
}
