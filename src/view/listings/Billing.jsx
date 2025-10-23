import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPrint, FaWhatsapp, FaSms } from "react-icons/fa";
import axiosInstance from "../../config/API";
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import { fetchBillings, deleteBilling } from "../../slice/BillingSlice";
import { fetchCompanies } from "../../slice/CompanySlice";
import moment from "moment";
import { generateInvoicePdf } from "../../pdf/BillingPdf";

const Billing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { billing } = useSelector((s) => s.billing);
  const companies = useSelector((s) => s.company.company);
  const [searchTerm, setSearchTerm] = useState("");

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

  // ✅ Upload PDF to backend
  const uploadPdfBlob = async (blob) => {
    const formData = new FormData();
    formData.append("pdf_file", blob, `invoice-${Date.now()}.pdf`);
    formData.append("action", "uploadPdf");

    try {
      const response = await axiosInstance.post("/billing.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      if (data.head.code === 200) {
        return data.body.pdf_url; // ✅ Direct backend URL
      } else {
        throw new Error(data.head.msg || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // ✅ WhatsApp & SMS Share URL
  const generateShareURL = (number, message, type = "whatsapp") => {
    const encodedMessage = encodeURIComponent(message);
    if (type === "whatsapp") {
      return `https://wa.me/${number}?text=${encodedMessage}`;
    } else if (type === "sms") {
      return `sms:${number}?body=${encodedMessage}`;
    }
    return "";
  };

  // ✅ WhatsApp Share for Salon / Spa
  const handleWhatsAppShare = async (item) => {
    if (!item.phone) {
      NotifyData("Phone number not available for this bill!", "error");
      return;
    }

    try {
      const companyDetails = companies[0] || {};
      const blob = await generateInvoicePdf(item, companyDetails);
      const pdfUrl = await uploadPdfBlob(blob);

      const phoneDigits = String(item.phone).replace(/\D/g, "");
      const internationalPhone =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

      // 💈 Friendly + Professional Message (With Correct Google Review Link)
      const reviewLink = "https://g.page/r/CStWMRIiiKCDEAE/review"; // 🔗 Replace with your actual Google review link
      const message = `Hi ${item.name},\n\nThank you for visiting ${
        companyDetails.company_name || "Black Trends Salon & Spa"
      }.\nWe truly appreciate your time with us!\n\n🧾 Download your invoice below 👇\n${pdfUrl}\n\n💬 We'd love to hear your feedback!\nPlease share your review here:\n${reviewLink}\n\nLooking forward to serving you again soon 💇‍♂️💆‍♀️\n\nWarm Regards,\n${
        companyDetails.company_name || "Black Trends Team"
      }`;

      const waUrl = generateShareURL(internationalPhone, message, "whatsapp");
      window.open(waUrl, "_blank");
    } catch (error) {
      console.error("WhatsApp share failed:", error);
      NotifyData("Failed to share on WhatsApp", "error");
    }
  };

  // ✅ SMS Share for Salon / Spa
  const handleSMSShare = async (item) => {
    if (!item.phone) {
      NotifyData("Phone number not available for this bill!", "error");
      return;
    }

    try {
      const companyDetails = companies[0] || {};
      const blob = await generateInvoicePdf(item, companyDetails);
      const pdfUrl = await uploadPdfBlob(blob);

      const phoneDigits = String(item.phone).replace(/\D/g, "");
      const phoneNumber =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

      // 💬 Short + Professional Message (With Correct Google Review Link)
      const reviewLink = "https://g.page/r/CStWMRIiiKCDEAE/review"; // 🔗 Replace with your actual Google review link
      const message = `Hi ${item.name}, Thank you for visiting ${
        companyDetails.company_name || "Black Trends Salon & Spa"
      }. Download your invoice: ${pdfUrl} | Please leave your review: ${reviewLink} - ${
        companyDetails.company_name || "Black Trends Team"
      }`;

      const smsUrl = generateShareURL(phoneNumber, message, "sms");
      window.open(smsUrl, "_blank");
    } catch (error) {
      console.error("SMS share failed:", error);
      NotifyData("Failed to send SMS", "error");
    }
  };

  // ✅ Print PDF
  const handlePrint = async (item) => {
    const companyDetails = companies[0] || {};
    const blob = await generateInvoicePdf(item, companyDetails);
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    newWindow.onload = () => {
      newWindow.print();
      URL.revokeObjectURL(url);
    };
  };

  const filteredBilling = billing.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.member_no || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(item.phone || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStaffNames = (item) => {
    try {
      const details = JSON.parse(item.productandservice_details);

      if (!details || details.length === 0) {
        return "";
      }

      const unique = [];

      details.forEach((d) => {
        if (d.staff_id && d.staff_name && d.staff_name.trim() !== "") {
          if (!unique.some((u) => u.staff_id === d.staff_id)) {
            unique.push(d);
          }
        }
      });

      return unique.map((s) => s.staff_name).join(", ");
    } catch (e) {
      return "";
    }
  };

  // 🔹 TABLE HEADERS
  const headers = [
    "No",
    "Date",
    "Member No",
    "Name",
    "Phone",
    "Service Provider",
    "Total",
  ];

  // 🔹 TABLE BODY
  const body = filteredBilling.map((item, idx) => ({
    key: item.billing_id,
    values: [
      idx + 1,
      formatDate(item.billing_date.split(" ")[0]),
      item.member_no,
      item.name,
      item.phone,
      getStaffNames(item) || "-",
      `₹ ${parseFloat(item.total).toFixed(2)}`,
      <ActionButton
        options={[
          {
            label: "Print",
            icon: <FaPrint />,
            onClick: () => handlePrint(item),
          },
          {
            label: "WhatsApp",
            icon: <FaWhatsapp style={{ color: "#25D366" }} />,
            onClick: () => handleWhatsAppShare(item),
          },
          {
            label: "SMS",
            icon: <FaSms style={{ color: "#007BFF" }} />,
            onClick: () => handleSMSShare(item),
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
          <Col xs="12" lg="3" className="py-2">
            <input
              type="text"
              placeholder="Search by name or phone or member no.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
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
