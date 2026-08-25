import ExcelJS from "exceljs";
import { getVoters } from "@/lib/db";
import { getSessionUser, isAdmin } from "@/lib/session";
import { jsonError } from "@/lib/security";

export async function GET() {
  const session = await getSessionUser();
  if (!isAdmin(session)) return jsonError("Akses ditolak.", 403);

  const voters = await getVoters();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data Pemilih");
  sheet.columns = [
    { header: "User ID", key: "userId", width: 20 },
    { header: "Nama Pengguna", key: "displayName", width: 28 },
    { header: "Nama Pemilih", key: "name", width: 28 },
    { header: "Tahun Angkatan", key: "cohort", width: 18 },
    { header: "Calon Pilihan", key: "candidateName", width: 38 }
  ];
  sheet.addRows(
    voters.map((voter) => ({
      userId: voter.userId ?? "-",
      displayName: voter.displayName ?? "-",
      name: voter.name,
      cohort: voter.cohort,
      candidateName: voter.candidateName ?? "-"
    }))
  );
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF696CFF" } };
  sheet.autoFilter = { from: "A1", to: "E1" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const output = await workbook.xlsx.writeBuffer();
  return new Response(output as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="data_pemilih.xlsx"'
    }
  });
}
