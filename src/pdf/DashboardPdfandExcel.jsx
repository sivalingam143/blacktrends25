import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../components/Forms";

// Export functions for Staff
export const downloadStaffExcel = (
  staff,
  staffFromDate,
  staffToDate,
  staffColumns
) => {
  const headers = staffColumns.map((col) => col.title);
  const data = staff.map((row, index) => [
    index + 1, // S.No
    ...staffColumns.slice(1).map((col) => {
      if (col.dataIndex === "report_date")
        return formatDate(row[col.dataIndex]);
      if (col.dataIndex === "total") return `₹${row[col.dataIndex] || 0}`;
      return row[col.dataIndex] || "-";
    }),
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Staff Report");
  XLSX.writeFile(wb, `Staff_Report_${staffFromDate}_to_${staffToDate}.xlsx`);
};

export const downloadStaffPDF = (staff, staffFromDate, staffToDate) => {
  const doc = new jsPDF();
  doc.text("Staff Report", 14, 20);
  doc.text(
    `Date Range: ${formatDate(staffFromDate)} to ${formatDate(staffToDate)}`,
    14,
    30
  );
  const tableData = staff.map((row) => [
    formatDate(row.report_date),
    row.name,
    row.phone,
    row.address || "-",
    row.total || 0,
  ]);
  autoTable(doc, {
    head: [["Date", "Name", "Phone", "Address", "Total"]],
    body: tableData,
    startY: 40,
  });
  doc.save(`Staff_Report_${staffFromDate}_to_${staffToDate}.pdf`);
};

// Export functions for Member
export const downloadMemberExcel = (
  member,
  memberFromDate,
  memberToDate,
  memberColumns
) => {
  const headers = memberColumns.map((col) => col.title);
  const data = member.map((row, index) => [
    index + 1, // S.No
    ...memberColumns.slice(1).map((col) => {
      if (col.dataIndex === "report_date")
        return formatDate(row[col.dataIndex]);
      if (col.dataIndex === "total_spending")
        return `₹${row[col.dataIndex] || 0}`;
      if (col.dataIndex === "membership")
        return row[col.dataIndex] === "Yes" ? "Yes" : "No";
      return row[col.dataIndex] || "-";
    }),
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Member Report");
  XLSX.writeFile(wb, `Member_Report_${memberFromDate}_to_${memberToDate}.xlsx`);
};

export const downloadMemberPDF = (member, memberFromDate, memberToDate) => {
  const doc = new jsPDF();
  doc.text("Member Report", 14, 20);
  doc.text(
    `Date Range: ${formatDate(memberFromDate)} to ${formatDate(memberToDate)}`,
    14,
    30
  );
  const tableData = member.map((row) => [
    formatDate(row.report_date),
    row.member_no,
    row.name,
    row.phone,
    row.membership === "Yes" ? "Yes" : "No",
    row.total_spending || 0,
  ]);
  autoTable(doc, {
    head: [
      [
        "Date",
        "Member No",
        "Name",
        "Phone",
        "Gold Membership",
        "Total Spending",
      ],
    ],
    body: tableData,
    startY: 40,
  });
  doc.save(`Member_Report_${memberFromDate}_to_${memberToDate}.pdf`);
};
