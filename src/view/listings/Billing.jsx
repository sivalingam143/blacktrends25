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
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import { fetchBillings, deleteBilling } from "../../slice/BillingSlice";

const Billing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { billing } = useSelector((s) => s.billing);

  useEffect(() => {
    dispatch(fetchBillings(""));
  }, [dispatch]);

  const handleCreate = () => navigate("/billing/create");
  const handleEdit = (item) => navigate(`/billing/edit/${item.billing_id}`);

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

    const doc = new jsPDF({
      unit: "mm",
      format: [58, 200], // 58mm width, dynamic height
    });

    let y = 5;

    // 🔹 HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Black Trends", 29, y, { align: "center" });
    y += 4;
    doc.setFontSize(8);
    doc.text("Hair & Skin", 29, y, { align: "center" });
    y += 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("105/6, Kacheeri Road,", 29, y, { align: "center" });
    y += 2.5;
    doc.text("Virudhunagar - 626001", 29, y, { align: "center" });
    y += 2.5;
    doc.text("Ph: 8300816120 / 962515524", 29, y, { align: "center" });
    y += 2.5;
    doc.text("GST: 33CXPS384C2Z0", 29, y, { align: "center" });
    y += 3;

    // Separator
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 INVOICE TITLE
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("SALES INVOICE", 29, y, { align: "center" });
    y += 3;
    doc.line(3, y, 55, y);
    y += 2;

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

    // 🔹 ITEM TABLE HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("Item", 3, y);
    doc.text("Stf", 22, y);
    doc.text("Rate", 30, y);
    doc.text("Dis", 38, y);
    doc.text("Qty", 44, y);
    doc.text("Amt", 55, y, { align: "right" });
    y += 2;

    doc.line(3, y, 55, y); // line below header
    y += 2;

    // 🔹 ITEM DETAILS (NO line per item)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    let totalQty = 0;

    details.forEach((d, i) => {
      if (y > 160) return; // stop if height exceeded

      const name = String(d.productandservice_name || "-").substring(0, 15);
      const staff = String(d.staff_name || "-").substring(0, 6);
      const rate = parseFloat(d.productandservice_price || 0).toFixed(0);
      const dis = `${d.discount || 0}${d.discount_type === "PER" ? "%" : ""}`;
      const qty = parseFloat(d.qty || 1);
      const total = parseFloat(d.total || 0).toFixed(0);

      totalQty += qty;

      doc.text(`${i + 1}. ${name}`, 3, y);
      doc.text(staff, 22, y);
      doc.text(rate, 30, y);
      doc.text(dis, 38, y);
      doc.text(String(qty), 44, y);
      doc.text(total, 55, y, { align: "right" });
      y += 3;
    });

    // line below last item
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 TOTALS SECTION (aligned)
    const subtotal = parseFloat(item.subtotal || item.total || 0);
    const discount = parseFloat(item.discount || 0);
    const grand = parseFloat(item.total || 0);

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

    y += 2;
    doc.line(3, y, 55, y);
    y += 3;

    // 🔹 FOOTER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("*** THANK YOU ***", 29, y, { align: "center" });
    y += 3;
    doc.text("PLEASE VISIT AGAIN", 29, y, { align: "center" });

    // 🔹 SAVE PDF
    doc.save(`billing_${item.billing_id}.pdf`);
    NotifyData("Optimized 58mm PDF Generated!", "success");
  };

  // 🔹 TABLE HEADERS
  const headers = ["No", "Date", "Member No", "Name", "Total"];

  // 🔹 TABLE BODY
  const body = billing.map((item, idx) => ({
    key: item.billing_id,
    values: [
      idx + 1,
      item.billing_date.split(" ")[0],
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
            onClick: () => handleDelete(item.id),
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
