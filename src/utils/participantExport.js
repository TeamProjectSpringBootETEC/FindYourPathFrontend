import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const safe = (v) => (v == null ? "" : String(v).trim());

const toRows = (participants) =>
  participants.map((p) => ({
    Name: p.fullName || p.userName || "Unknown",
    Email: safe(p.email),
    Phone: safe(p.phone),
    "Ticket Code": safe(p.ticketCode),
    Status: p.arrived ? "Arrived" : "Registered",
    "Checked In At": p.arrived && p.checkedInAt
      ? new Date(p.checkedInAt).toLocaleString("en-GB")
      : "",
    Note: safe(p.note),
  }));

const defaultTitle = (eventTitle) =>
  safe(eventTitle).replace(/[\\/:*?"<>|]/g, "_") || "event";

export const exportToExcel = (participants, eventTitle) => {
  const rows = toRows(participants);
  const ws = XLSX.utils.json_to_sheet(rows);
  if (rows.length) {
    ws["!cols"] = [
      { wch: 22 },
      { wch: 30 },
      { wch: 16 },
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 30 },
    ];
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Participants");
  XLSX.writeFile(wb, `${defaultTitle(eventTitle)}-participants.xlsx`);
};

export const exportToPdf = (participants, eventTitle) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(eventTitle || "Event Participants", 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated: ${new Date().toLocaleString("en-GB")}`,
    14,
    22
  );
  autoTable(doc, {
    startY: 28,
    head: [["Attendee", "Email", "Phone", "Ticket Code", "Status"]],
    body: participants.map((p) => [
      p.fullName || p.userName || "Unknown",
      safe(p.email),
      safe(p.phone),
      safe(p.ticketCode),
      p.arrived ? "Arrived" : "Registered",
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] },
  });
  doc.save(`${defaultTitle(eventTitle)}-participants.pdf`);
};