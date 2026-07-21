import { jsPDF } from "jspdf";

import { formatLongDate, hhmm } from "@/lib/labels";
import type { MyAppointment } from "@/lib/patient-api";

const BRAND: [number, number, number] = [209, 80, 111]; // brand-500 #d1506f
const INK: [number, number, number] = [43, 58, 46]; // sage-900
const MUTED: [number, number, number] = [120, 130, 120];

export function downloadAppointmentReceipt(appt: MyAppointment): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 48;
  let y = 64;

  // Header
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, pageW, 6, "F");

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Dr. Surbhi Patne", marginX, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND);
  doc.text("Obstetrician & Gynaecologist", marginX, y + 18);
  doc.setTextColor(...MUTED);
  doc.setFontSize(10);
  doc.text("Bhilai, Chhattisgarh  ·  +91 8225978199", marginX, y + 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text("APPOINTMENT RECEIPT", pageW - marginX, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(appt.appointment_number, pageW - marginX, y + 18, { align: "right" });

  y += 60;
  doc.setDrawColor(230, 220, 224);
  doc.line(marginX, y, pageW - marginX, y);
  y += 30;

  const rows: [string, string][] = [
    ["Patient", appt.patient_name],
    ["Status", appt.appointment_status],
    ["Token number", `#${appt.token_number}`],
    ["Date", formatLongDate(appt.appointment_date)],
    ["Time", `${hhmm(appt.start_time)} – ${hhmm(appt.end_time)}`],
    ["Doctor", appt.doctor_name],
    ["Clinic", appt.clinic_name],
    ["Clinic address", appt.clinic_address],
    ["Consultation fee", appt.consultation_fee ? `Rs. ${appt.consultation_fee}` : "—"],
  ];

  doc.setFontSize(11);
  for (const [label, value] of rows) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, marginX, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(value, pageW - marginX * 2 - 160) as string[];
    doc.text(lines, marginX + 160, y);
    y += 22 + (lines.length - 1) * 14;
  }

  y += 16;
  doc.setDrawColor(230, 220, 224);
  doc.line(marginX, y, pageW - marginX, y);
  y += 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    "This is a computer-generated receipt. Please arrive 10 minutes before your appointment time.",
    marginX,
    y,
  );

  doc.save(`receipt-${appt.appointment_number}.pdf`);
}
