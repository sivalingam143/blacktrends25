import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/images/storelogo.png";

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
    marginBottom: "3mm",
    paddingBottom: "3mm",
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
              Ph: {`${companyDetails.contact_number}, 70105 35346` || "Phone Number"}
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
             <Text style={styles.value}>{`${item.phone}`}</Text>
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
          <Text style={{ fontSize: "5pt", textAlign: "center" }}>
             {"  "}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const generateInvoicePdf = async (item, companyDetails) => {
  return await pdf(
    <Invoice item={item} companyDetails={companyDetails} />
  ).toBlob();
};
