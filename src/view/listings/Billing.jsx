import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPrint, FaWhatsapp, FaSms } from "react-icons/fa";
import axios from "axios";
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

  // NEW: Function to shorten URL using TinyURL API
  const shortenUrl = async (url) => {
    try {
      const response = await axios.get(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
      );
      return response.data;
    } catch (error) {
      console.error("Shorten error:", error);
      return url; // fallback to original URL
    }
  };

  // UPDATED: Function to upload PDF blob and get URL using axiosInstance
  const uploadPdfBlob = async (blob) => {
    const formData = new FormData();
    formData.append("pdf_file", blob, `invoice-${Date.now()}.pdf`);
    formData.append("action", "uploadPdf"); // To match PHP action

    try {
      // Assuming the billing endpoint is '/billing.php' - adjust if needed
      const response = await axiosInstance.post("/billing.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      if (data.head.code === 200) {
        return data.body.pdf_url;
      } else {
        throw new Error(data.head.msg || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // UPDATED: generateShareURL function for WhatsApp or SMS
  const generateShareURL = (
    number,
    message,
    pdfUrl = null,
    type = "whatsapp"
  ) => {
    let fullMessage = message;
    if (pdfUrl) {
      fullMessage += `\n\nஉங்கள் பில் PDF: ${pdfUrl}`;
    }
    const encodedMessage = encodeURIComponent(fullMessage);
    if (type === "whatsapp") {
      return `https://wa.me/${number}?text=${encodedMessage}`;
    } else if (type === "sms") {
      return `sms:${number}?body=${encodedMessage}`;
    }
    return "";
  };

  // UPDATED: handleWhatsAppShare - Now uploads PDF, shortens link, and sends via WhatsApp URL
  const handleWhatsAppShare = async (item) => {
    if (!item.phone) {
      NotifyData("Phone number not available for this bill!", "error");
      return;
    }

    try {
      const companyDetails = companies[0] || {};
      const blob = await generateInvoicePdf(item, companyDetails);

      // Upload PDF to get public URL
      const pdfUrl = await uploadPdfBlob(blob);

      // Shorten the PDF URL
      const shortPdfUrl = await shortenUrl(pdfUrl);

      // Prepare message
      const phoneStr = String(item.phone || "");
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const internationalPhone =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

      const message = `Hi ${item.name}`;

      // Open WhatsApp with message + shortened PDF link
      const waUrl = generateShareURL(
        internationalPhone,
        message,
        shortPdfUrl,
        "whatsapp"
      );
      window.open(waUrl, "_blank");
    } catch (error) {
      console.error("WhatsApp share failed:", error);
      // Fallback: Open WhatsApp with just message (no PDF)
      const phoneStr = String(item.phone || "");
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const internationalPhone =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
      const message = `Hi ${item.name}`;
      const waUrl = generateShareURL(
        internationalPhone,
        message,
        null,
        "whatsapp"
      );
      window.open(waUrl, "_blank");
    }
  };

  // NEW: handleSMSShare - Uploads PDF, shortens link, and opens SMS composer with message + link
  const handleSMSShare = async (item) => {
    if (!item.phone) {
      NotifyData("Phone number not available for this bill!", "error");
      return;
    }

    try {
      const companyDetails = companies[0] || {};
      const blob = await generateInvoicePdf(item, companyDetails);

      // Upload PDF to get public URL
      const pdfUrl = await uploadPdfBlob(blob);

      // Shorten the PDF URL
      const shortPdfUrl = await shortenUrl(pdfUrl);

      // Prepare message
      const phoneStr = String(item.phone || "");
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const phoneNumber =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

      const message = `Hi ${item.name}`;

      // Open SMS composer with message + shortened PDF link
      const smsUrl = generateShareURL(phoneNumber, message, shortPdfUrl, "sms");
      window.open(smsUrl, "_blank");
    } catch (error) {
      console.error("SMS share failed:", error);
      // Fallback: Open SMS with just message (no PDF)
      const phoneStr = String(item.phone || "");
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const phoneNumber =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
      const message = `Hi ${item.name}`;
      const smsUrl = generateShareURL(phoneNumber, message, null, "sms");
      window.open(smsUrl, "_blank");
    }
  };

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

  // 🔹 TABLE HEADERS
  const headers = ["No", "Date", "Member No", "Name", "Phone", "Total"];

  // 🔹 TABLE BODY
  const body = filteredBilling.map((item, idx) => ({
    key: item.billing_id,
    values: [
      idx + 1,
      formatDate(item.billing_date.split(" ")[0]),
      item.member_no,
      item.name,
      item.phone,
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
