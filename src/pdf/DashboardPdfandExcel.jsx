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
  const staffTotal = staff.reduce(
    (acc, row) => acc + (parseFloat(row.total) || 0),
    0
  );
  const headers = staffColumns.map((col) => col.title);
  const data = staff.map((row, index) => [
    index + 1, // S.No
    ...staffColumns.slice(1).map((col) => {
      if (col.dataIndex === "report_date")
        return formatDate(row[col.dataIndex]);
      if (col.dataIndex === "total")
        return `Rs.${(parseFloat(row[col.dataIndex]) || 0).toFixed(2)}`;
      return row[col.dataIndex] || "-";
    }),
  ]);
  data.push([
    "",
    "",
    "",
    "",
    "Overall Total",
    `Rs.${Number(staffTotal.toFixed(2)).toLocaleString("en-IN")}`,
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Staff Report");
  XLSX.writeFile(wb, `Staff_Report_${staffFromDate}_to_${staffToDate}.xlsx`);
};

export const downloadStaffPDF = (staff, staffFromDate, staffToDate) => {
  const staffTotal = staff.reduce(
    (acc, row) => acc + (parseFloat(row.total) || 0),
    0
  );
  const doc = new jsPDF();
  doc.text("Staff Report", 14, 20);
  doc.text(
    `Date Range: ${formatDate(staffFromDate)} to ${formatDate(staffToDate)}`,
    14,
    30
  );
  const tableData = staff.map((row, index) => [
    index + 1,
    formatDate(row.report_date),
    row.name,
    row.phone,
    row.address || "-",
    `Rs. ${(parseFloat(row.total) || 0).toFixed(2)}`,
  ]);
  tableData.push([
    "",
    "",
    "",
    "",
    "Overall Total",
    `Rs. ${Number(staffTotal.toFixed(2)).toLocaleString("en-IN")}`,
  ]);
  autoTable(doc, {
    head: [["S.No", "Date", "Name", "Phone", "Address", "Total"]],
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
  const memberTotal = member.reduce(
    (acc, row) => acc + (parseFloat(row.total) || 0),
    0
  );
  const memberCashTotal = member.reduce(
    (acc, row) => acc + (parseFloat(row.cash) || 0),
    0
  );
  const memberGPayTotal = member.reduce(
    (acc, row) => acc + (parseFloat(row.gpay) || 0),
    0
  );
  const headers = memberColumns.map((col) => col.title);
  const data = member.map((row, index) => [
    index + 1, // S.No
    ...memberColumns.slice(1).map((col) => {
      if (col.dataIndex === "report_date")
        return formatDate(row[col.dataIndex]);
      if (col.dataIndex === "total")
        return `Rs. ${(parseFloat(row[col.dataIndex]) || 0).toFixed(2)}`;
      if (col.dataIndex === "membership")
        return row[col.dataIndex] === "Yes" ? "Yes" : "No";
      if (col.dataIndex === "cash")
        return `Rs. ${(parseFloat(row[col.dataIndex]) || 0).toFixed(2)}`;
      if (col.dataIndex === "gpay")
        return `Rs. ${(parseFloat(row[col.dataIndex]) || 0).toFixed(2)}`;
      return row[col.dataIndex] || "-";
    }),
  ]);
  data.push([
    ...Array(6).fill(""),
    "Overall Cash",
    "Overall GPay",
    "Overall Total",
  ]);
  data.push([
    ...Array(6).fill(""),
    `Rs. ${Number(memberCashTotal.toFixed(2)).toLocaleString("en-IN")}`,
    `Rs. ${Number(memberGPayTotal.toFixed(2)).toLocaleString("en-IN")}`,
    `Rs. ${Number(memberTotal.toFixed(2)).toLocaleString("en-IN")}`,
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Member Report");
  XLSX.writeFile(wb, `Member_Report_${memberFromDate}_to_${memberToDate}.xlsx`);
};

export const downloadMemberPDF = (member, memberFromDate, memberToDate) => {
  const memberTotal = member.reduce(
    (acc, row) => acc + (parseFloat(row.total) || 0),
    0
  );
  const memberCashTotal = member.reduce(
    (acc, row) => acc + (parseFloat(row.cash) || 0),
    0
  );
  const memberGPayTotal = member.reduce(
    (acc, row) => acc + (parseFloat(row.gpay) || 0),
    0
  );
  const doc = new jsPDF();
  doc.text("Member Report", 14, 20);
  doc.text(
    `Date Range: ${formatDate(memberFromDate)} to ${formatDate(memberToDate)}`,
    14,
    30
  );
  const tableData = member.map((row, index) => [
    index + 1,
    formatDate(row.report_date),
    row.member_no,
    row.name,
    row.phone,
    row.membership === "Yes" ? "Yes" : "No",
    `Rs. ${(parseFloat(row.cash) || 0).toFixed(2)}`,
    `Rs. ${(parseFloat(row.gpay) || 0).toFixed(2)}`,
    `Rs. ${(parseFloat(row.total) || 0).toFixed(2)}`,
  ]);
  tableData.push([
    "",
    "",
    "",
    "",
    "",
    "",
    "Overall Cash",
    "Overall GPay",
    "Overall Total",
  ]);
  tableData.push([
    "",
    "",
    "",
    "",
    "",
    "",
    `Rs. ${Number(memberCashTotal.toFixed(2)).toLocaleString("en-IN")}`,
    `Rs. ${Number(memberGPayTotal.toFixed(2)).toLocaleString("en-IN")}`,
    `Rs. ${Number(memberTotal.toFixed(2)).toLocaleString("en-IN")}`,
  ]);
  autoTable(doc, {
    head: [
      [
        "S.No",
        "Date",
        "Member No",
        "Name",
        "Phone",
        "Gold Membership",
        "Cash",
        "GPay",
        "Total Spending",
      ],
    ],
    body: tableData,
    startY: 40,
  });
  doc.save(`Member_Report_${memberFromDate}_to_${memberToDate}.pdf`);
};
