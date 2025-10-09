import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPrint } from "react-icons/fa";
import jsPDF from "jspdf";
import logo from "../../assets/images/storelogo.png";
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import { fetchBillings, deleteBilling } from "../../slice/BillingSlice";
import { fetchCompanies } from "../../slice/CompanySlice";
import moment from "moment";

const Billing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { billing } = useSelector((s) => s.billing);
  const companies = useSelector((s) => s.company.company);

  useEffect(() => {
    dispatch(fetchBillings(""));
    dispatch(fetchCompanies(""));
  }, [dispatch]);

  const handleCreate = () => navigate("/billing/create");
  const handleEdit = (item) => navigate(`/billing/edit/${item.billing_id}`);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return moment(dateString, "YYYY-MM-DD").format("DD-MM-YYYY");
  };

  const handleDelete = async (id) => {
    try {
      const msg = await dispatch(deleteBilling(id)).unwrap();
      NotifyData(msg, "success");
      dispatch(fetchBillings(""));
    } catch (e) {
      NotifyData(e.message, "error");
    }
  };

  const handlePrint = (item) => {
    let details = [];
    try {
      details = item.productandservice_details
        ? JSON.parse(item.productandservice_details)
        : [];
    } catch (e) {
      console.error("Error parsing details:", e);
    }

    const companyDetails = companies[0] || {};
    const doc = new jsPDF({
      unit: "mm",
      format: [58, 150],
    });

    let y = 5;

    // Add Logo Image above the header
    doc.addImage(logo, "PNG", 15, y, 30, 20); // Centered logo: x=20 (center of 58mm), width=18mm, height=10mm
    y += 25; // Adjust y position after logo (height + some space)

    // 🔹 HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(companyDetails.company_name || "Company Name", 29, y, {
      align: "center",
    });
    y += 4;
    doc.setFontSize(8);
    doc.text("Hair | Skin | Makeup | Spa", 29, y, { align: "center" });
    y += 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(companyDetails.address || "Address", 29, y, { align: "center" });
    y += 2.5;
    doc.text(`Ph: ${companyDetails.contact_number || "Phone Number"}`, 29, y, {
      align: "center",
    });

    y += 3;

    // Separator
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 INVOICE TITLE
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("SALES INVOICE", 30, y, { align: "center" });
    y += 3;
    doc.setFontSize(5);
    doc.text("(Soozhakkarai Medu)", 30, y, { align: "center" });
    y += 2;
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 INVOICE DETAILS (aligned)
    const leftX = 3;
    const colonX = 20;
    const valueX = 27;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);

    const addDetail = (label, value) => {
      doc.text(label, leftX, y);
      doc.text(":", colonX, y);
      doc.text(String(value), valueX, y);
      y += 3;
    };

    addDetail("Invoice No", item.member_no || "-");
    addDetail("Date", item.billing_date.split(" ")[0]);
    addDetail("Customer", item.name || "-");
    addDetail("Mobile", item.phone || "-");
    addDetail("Membership", item.membership || "-");

    y += 2;
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 ITEM TABLE HEADER (multi-line for better alignment)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    let headerStartY = y;

    // First line of header
    doc.text("Service &", 3, headerStartY);
    doc.text("Service", 18, headerStartY);
    doc.text("Rate", 28, headerStartY);
    doc.text("Dis", 36, headerStartY);
    doc.text("Qty", 43, headerStartY);
    doc.text("Amt", 52, headerStartY, { align: "right" });

    // Second line of header
    let headerSecondY = headerStartY + 2.5;
    doc.text("Products", 3, headerSecondY);
    doc.text("Provider", 18, headerSecondY);

    y = headerSecondY + 2;
    doc.line(3, y, 55, y); // line below header
    y += 3;

    // 🔹 ITEM DETAILS (adjusted x positions to match headers)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    let totalQty = details.length; // Count of products instead of sum of quantities

    details.forEach((d, i) => {
      if (y > 160) return; // stop if height exceeded

      const name = String(d.productandservice_name || "-").substring(0, 14); // Slightly shorter for better fit
      const staff = String(d.staff_name || "-").substring(0, 7); // Adjusted length
      const rate = parseFloat(d.productandservice_price || 0).toFixed(0);
      const dis = parseFloat(d.discount_amount || 0).toFixed(0);
      const qty = parseFloat(d.qty || 1);
      const total = parseFloat(d.total || 0).toFixed(0);

      doc.text(name, 3, y); // Align under header
      doc.text(staff, 18, y); // Align under Provider
      doc.text(rate, 28, y); // Align under Rate
      doc.text(dis, 36, y); // Align under Dis
      doc.text(String(qty), 43, y); // Align under Qty
      doc.text(total, 52, y, { align: "right" }); // Right-aligned under Amt
      y += 3;
    });

    // line below last item
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 TOTALS SECTION (aligned)
    const subtotal = parseFloat(item.subtotal || item.total || 0);
    const discount = parseFloat(item.discount || 0);
    const grand = parseFloat(item.total || 0);
    const paid = parseFloat(item.paid || 0);
    const balance = parseFloat(item.balance || 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);

    const addTotalLine = (label, value) => {
      doc.text(label, leftX, y);
      doc.text(":", colonX, y);
      doc.text(String(value), valueX, y);
      y += 3;
    };

    addTotalLine("Total Qty", totalQty);
    addTotalLine("Subtotal", subtotal.toFixed(2));
    addTotalLine("Discount", discount.toFixed(2));
    addTotalLine("Grand Total", grand.toFixed(2));
    addTotalLine("Paid", paid.toFixed(2));
    addTotalLine("Balance", balance.toFixed(2));

    y += 2;
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 FOOTER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("We wish to have your support always.", 29, y, {
      align: "center",
    });
    y += 3;
    doc.text("*** THANK YOU.PLEASE VISIT AGAIN ***", 29, y, {
      align: "center",
    });

    // 🔹 SAVE PDF
    doc.save(`billing_${item.member_no}.pdf`);
  };

  // 🔹 TABLE HEADERS
  const headers = ["No", "Date", "Member No", "Name", "Total"];

  // 🔹 TABLE BODY
  const body = billing.map((item, idx) => ({
    key: item.billing_id,
    values: [
      idx + 1,
      formatDate(item.billing_date.split(" ")[0]),
      item.member_no,
      item.name,
      `₹ ${parseFloat(item.total).toFixed(2)}`,
      <ActionButton
        options={[
          {
            label: "Print",
            icon: <FaPrint />,
            onClick: () => handlePrint(item),
          },
          {
            label: "Edit",
            icon: <LiaEditSolid />,
            onClick: () => handleEdit(item),
          },
          {
            label: "Delete",
            icon: <MdOutlineDelete />,
            onClick: () => handleDelete(item.billing_id),
          },
        ]}
        label={<HiOutlineDotsVertical />}
      />,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="Billing" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="add-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI
              headers={headers}
              body={body}
              className="table"
              showActionColumn={true}
              noRecordMessage="No billings found"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Billing;
