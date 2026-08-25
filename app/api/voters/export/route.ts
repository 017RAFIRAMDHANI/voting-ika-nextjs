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
    { header: "Calon Pilihan", key: "candidateName", width: 38 }
  ];
  sheet.addRows(
    voters.map((voter) => ({
      userId: voter.userId ?? "-",
      candidateName: voter.candidateName ?? "-"
    }))
  );
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF696CFF" } };
  sheet.autoFilter = { from: "A1", to: "B1" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const output = await workbook.xlsx.writeBuffer();
  return new Response(output as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="data_pemilih.xlsx"'
    }
  });
}
