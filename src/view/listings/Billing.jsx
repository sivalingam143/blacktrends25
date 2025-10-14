import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPrint, FaWhatsapp } from "react-icons/fa";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import * as buffer from "buffer"; // Add this import for Buffer polyfill
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
  const [searchTerm, setSearchTerm] = useState("");

  // Add Buffer polyfill for browser
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Buffer) {
      window.Buffer = buffer.Buffer;
    }
  }, []);

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

  const styles = StyleSheet.create({
    page: {
      padding: 0,
      margin: 0,
      backgroundColor: "#FFFFFF",
      width: "58mm",
      height: "fit-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logo: {
      width: "30mm",
      height: "20mm",
      marginTop: "2mm",
      marginBottom: "2mm",
      alignSelf: "center",
    },
    contentWrapper: {
      width: "54mm",
      alignSelf: "center",
    },
    header: {
      width: "54mm",
      textAlign: "center",
      marginBottom: "2mm",
    },
    companyName: {
      fontSize: "14pt",
      fontWeight: "bold",
      marginBottom: "1mm",
    },
    tagline: {
      fontSize: "10pt",
      marginBottom: "0.5mm",
    },
    address: {
      fontSize: "7pt",
      marginBottom: "0.5mm",
    },
    phone: {
      fontSize: "7pt",
      marginBottom: "0.5mm",
    },
    line: {
      width: "54mm",
      borderBottomWidth: 1,
      borderBottomColor: "black",
      marginVertical: "0.5mm",
      height: 0,
    },
    title: {
      fontSize: "9pt",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "0.5mm",
      marginBottom: "0mm",
    },
    subtitle: {
      fontSize: "7pt",
      textAlign: "center",
      marginBottom: "0.5mm",
    },
    detailContainer: {
      width: "54mm",
      marginTop: "0mm",
    },
    detailRow: {
      flexDirection: "row",
      marginBottom: "1.5mm",
      fontSize: "8pt",
    },
    label: {
      width: "20mm",
      textAlign: "left",
    },
    colon: {
      width: "7mm",
      textAlign: "center",
    },
    value: {
      width: "31mm",
      textAlign: "right",
    },
    tableHeader: {
      width: "54mm",
      marginTop: "0.5mm",
    },
    tableHeaderRow1: {
      flexDirection: "row",
      fontSize: "8pt",
      fontWeight: "bold",
      marginBottom: "0.5mm",
    },
    tableHeaderRow2: {
      flexDirection: "row",
      fontSize: "8pt",
      fontWeight: "bold",
      marginBottom: "0.5mm",
    },
    col1: { width: "13mm", textAlign: "left" },
    col2: { width: "11mm", textAlign: "left" },
    col3: { width: "7mm", textAlign: "right" },
    col4: { width: "7mm", textAlign: "right" },
    col5: { width: "7mm", textAlign: "right" },
    col6: { width: "9mm", textAlign: "right" },
    itemsContainer: {
      width: "54mm",
    },
    tableRow: {
      flexDirection: "row",
      marginBottom: "1.5mm",
      fontSize: "6pt",
    },
    totalsContainer: {
      width: "54mm",
      marginTop: "0.5mm",
    },
    totalRow: {
      flexDirection: "row",
      marginBottom: "1.5mm",
      fontSize: "8.5pt",
      fontWeight: "bold",
    },
    footer: {
      width: "54mm",
      textAlign: "center",
      fontSize: "8pt",
      fontWeight: "bold",
      marginTop: "5.5mm",
      marginBottom: "0mm",
    },
    footer2: {
      width: "54mm",
      textAlign: "center",
      fontSize: "8pt",
      fontWeight: "bold",
      marginTop: "5.5mm",
      marginBottom: "0mm",
    },
  });

  const Invoice = ({ item, companyDetails }) => {
    let details = [];
    try {
      details = item.productandservice_details
        ? JSON.parse(item.productandservice_details)
        : [];
    } catch (e) {
      console.error("Error parsing details:", e);
    }

    const numItems = details.length;
    const contentHeight = 200 + numItems * 4;
    const totalHeight = Math.ceil(contentHeight + 20);

    const pageHeight = `${totalHeight}mm`;

    return (
      <Document>
        <Page size={{ width: "58mm", height: pageHeight }} style={styles.page}>
          <View style={styles.logo}>
            <Image src={logo} style={{ width: "30mm", height: "20mm" }} />
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <Text style={styles.companyName}>
                {companyDetails.company_name || "Company Name"}
              </Text>
              <Text style={styles.tagline}>Hair | Skin | Makeup | Spa</Text>
              <Text style={styles.address}>
                {companyDetails.address || "Address"}
              </Text>
              <Text style={styles.phone}>
                Ph: {companyDetails.contact_number || "Phone Number"}
              </Text>
            </View>

            <View style={styles.line} />

            <Text style={styles.title}>SALES INVOICE</Text>
            <Text style={styles.subtitle}>(Soozhakkarai Medu)</Text>
            <View style={styles.line} />

            <View style={styles.detailContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Invoice No</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.member_no || "-"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>
                  {item.billing_date.split(" ")[0]}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.name || "-"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Mobile</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.phone || "-"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Membership</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{item.membership || "-"}</Text>
              </View>
            </View>

            <View style={styles.line} />

            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderRow1}>
                <Text style={styles.col1}>Service &</Text>
                <Text style={styles.col2}>Service</Text>
                <Text style={styles.col3}>Rate</Text>
                <Text style={styles.col4}>Dis</Text>
                <Text style={styles.col5}>Qty</Text>
                <Text style={styles.col6}>Amt</Text>
              </View>
              <View style={styles.tableHeaderRow2}>
                <Text style={styles.col1}>Products</Text>
                <Text style={styles.col2}>Provider</Text>
                <View style={styles.col3} />
                <View style={styles.col4} />
                <View style={styles.col5} />
                <View style={styles.col6} />
              </View>
            </View>
            <View style={styles.line} />

            <View style={styles.itemsContainer}>
              {details.map((d, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>
                    {String(d.productandservice_name || "-").substring(0, 14)}
                  </Text>
                  <Text style={styles.col2}>
                    {String(d.staff_name || "-").substring(0, 7)}
                  </Text>
                  <Text style={styles.col3}>
                    {parseFloat(d.productandservice_price || 0).toFixed(0)}
                  </Text>
                  <Text style={styles.col4}>
                    {parseFloat(d.discount_amount || 0).toFixed(0)}
                  </Text>
                  <Text style={styles.col5}>{parseFloat(d.qty || 1)}</Text>
                  <Text style={styles.col6}>
                    {parseFloat(d.total || 0).toFixed(0)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.line} />

            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Total Qty</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{details.length}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>
                  {parseFloat(item.subtotal || item.total || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Discount</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>
                  {parseFloat(item.discount || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Grand Total</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>
                  {parseFloat(item.total || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Paid</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>
                  {parseFloat(item.paid || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Balance</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>
                  {parseFloat(item.balance || 0).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.line} />

            <View style={styles.footer}>
              <Text>We wish to have your support always.</Text>
            </View>
            <View style={styles.footer2}>
              <Text>*** THANK YOU. PLEASE VISIT AGAIN ***</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  const handlePrint = async (item) => {
    const companyDetails = companies[0] || {};
    const blob = await pdf(
      <Invoice item={item} companyDetails={companyDetails} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    newWindow.onload = () => {
      newWindow.print();
      URL.revokeObjectURL(url);
    };
  };

  const handleWhatsAppShare = async (item) => {
    if (!item.phone) {
      NotifyData("Phone number not available for this bill!", "error");
      return;
    }

    try {
      const companyDetails = companies[0] || {};
      const blob = await pdf(
        <Invoice item={item} companyDetails={companyDetails} />
      ).toBlob();

      const phoneStr = String(item.phone || "");
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const internationalPhone =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

      const fileName = `invoice-${item.billing_id || Date.now()}.pdf`;
      const shareFile = new File([blob], fileName, { type: "application/pdf" });

      // Prioritize direct share for immediate send (works on mobile)
      if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
        try {
          await navigator.share({
            title: `Invoice ${item.billing_id || ""}`,
            text: `Hi ${
              item.name
            }, உங்கள் பில் இங்கே. Please find attached invoice for your recent visit. Total: ₹${item.total.toFixed(
              2
            )}.`,
            files: [shareFile],
          });
          NotifyData(
            "PDF shared directly – select WhatsApp to send!",
            "success"
          );
        } catch (shareError) {
          console.warn("Share failed, falling back:", shareError);
          // Fallback to download + open
          throw shareError; // To trigger fallback
        }
      } else {
        // Fallback for desktop/browser without share support: Download and open WhatsApp
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        NotifyData(
          `PDF downloaded! Now opening WhatsApp – attach the file to ${item.name}'s chat.`,
          "info"
        );

        // Open WhatsApp Web/Desktop with pre-filled message
        const message = encodeURIComponent(
          `Hi ${item.name}, உங்கள் பில் attached. Total: ₹${item.total.toFixed(
            2
          )}. Please find the invoice PDF attached.`
        );
        window.open(
          `https://wa.me/${internationalPhone}?text=${message}`,
          "_blank"
        );
      }
    } catch (error) {
      console.error("WhatsApp share failed:", error);
      const phoneStr = String(item.phone || "");
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const internationalPhone =
        phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
      // Ultimate fallback: Just open WhatsApp with message (no PDF, but notify)
      const message = encodeURIComponent(
        `Hi ${
          item.name
        }, உங்கள் பில் PDF share செய்ய முயற்சி. Print option use பண்ணி manual send பண்ணுங்க. Total: ₹${item.total.toFixed(
          2
        )}.`
      );
      window.open(
        `https://wa.me/${internationalPhone}?text=${message}`,
        "_blank"
      );
      NotifyData(
        "Direct share not possible – opened WhatsApp. Please send PDF manually via print.",
        "warning"
      );
    }
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
