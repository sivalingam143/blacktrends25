import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Card, Input, Table, Typography, Row, Col, Button } from "antd";
import { fetchStaffReport, fetchMemberReport } from "../../slice/BillingSlice";
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import "./Dashboard.css";
import { formatDate, Calender } from "../../components/Forms";
import {
  downloadStaffExcel,
  downloadStaffPDF,
  downloadMemberExcel,
  downloadMemberPDF,
} from "../../pdf/DashboardPdfandExcel";

const { TabPane } = Tabs;
const { Text } = Typography;

const DashboardReports = () => {
  const dispatch = useDispatch();
  const [staffSearchText, setStaffSearchText] = useState("");
  const [memberSearchText, setMemberSearchText] = useState("");
  const [staffFrom, setStaffFrom] = useState(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const [staffTo, setStaffTo] = useState(moment().format("YYYY-MM-DD"));
  const [memberFrom, setMemberFrom] = useState(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const [memberTo, setMemberTo] = useState(moment().format("YYYY-MM-DD"));

  const {
    staffReport: staff,
    memberReport: member,
    status,
    error,
  } = useSelector((state) => state.billing);

  // Calculate totals
  const staffTotal = staff.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );
  const memberTotal = member.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );

  // Fetch reports
  useEffect(() => {
    if (staffFrom && staffTo) {
      dispatch(
        fetchStaffReport({
          fromDate: staffFrom,
          toDate: staffTo,
          searchText: staffSearchText,
        })
      );
    }
  }, [dispatch, staffFrom, staffTo, staffSearchText]);

  useEffect(() => {
    if (memberFrom && memberTo) {
      dispatch(
        fetchMemberReport({
          fromDate: memberFrom,
          toDate: memberTo,
          searchText: memberSearchText,
        })
      );
    }
  }, [dispatch, memberFrom, memberTo, memberSearchText]);

  const handleStaffSearchChange = (value) => {
    setStaffSearchText(value);
    if (staffFrom && staffTo) {
      dispatch(
        fetchStaffReport({
          fromDate: staffFrom,
          toDate: staffTo,
          searchText: value,
        })
      );
    }
  };

  const handleMemberSearchChange = (value) => {
    setMemberSearchText(value);
    if (memberFrom && memberTo) {
      dispatch(
        fetchMemberReport({
          fromDate: memberFrom,
          toDate: memberTo,
          searchText: value,
        })
      );
    }
  };

  // Download handlers
  const handleStaffExcelDownload = () => {
    downloadStaffExcel(staff, staffFrom, staffTo, staffColumns);
  };

  const handleStaffPDFDownload = () => {
    downloadStaffPDF(staff, staffFrom, staffTo);
  };

  const handleMemberExcelDownload = () => {
    downloadMemberExcel(member, memberFrom, memberTo, memberColumns);
  };

  const handleMemberPDFDownload = () => {
    downloadMemberPDF(member, memberFrom, memberTo);
  };

  const staffColumns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Date",
      dataIndex: "report_date",
      key: "report_date",
      align: "center",
      sorter: (a, b) => new Date(b.report_date) - new Date(a.report_date),
      render: (report_date) => formatDate(report_date),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "left",
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
      render: (t) => t || "-",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right",
      sorter: (a, b) => a.total - b.total,
      render: (t) => `₹${(parseFloat(t) || 0).toFixed(2)}`,
    },
  ];

  const memberColumns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Date",
      dataIndex: "report_date",
      key: "report_date",
      align: "center",
      sorter: (a, b) => new Date(b.report_date) - new Date(a.report_date),
      render: (date) => formatDate(date),
    },
    {
      title: "Member No",
      dataIndex: "member_no",
      key: "member_no",
      align: "center",
      sorter: (a, b) => a.member_no.localeCompare(b.member_no),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: "Gold Membership",
      dataIndex: "membership",
      key: "membership",
      align: "center",
      sorter: (a, b) => a.membership.localeCompare(b.membership),
      render: (m) => (m === "Yes" ? "Yes ✅" : "No ❌"),
    },
    {
      title: "Total Spending",
      dataIndex: "total",
      key: "total",
      align: "right",
      sorter: (a, b) => a.total - b.total,
      render: (t) => `₹${(parseFloat(t) || 0).toFixed(2)}`,
    },
  ];

  const tableFooter = (total, label = "Overall Total") => (
    <div
      style={{
        textAlign: "right",
        padding: "8px",
        fontWeight: "bold",
        borderTop: "1px solid #d9d9d9",
        backgroundColor: "#f9f9f9",
      }}
    >
      {label}: ₹{total.toFixed(2).toLocaleString("en-IN")}
    </div>
  );

  return (
    <div className="dashboard-container" id="main">
      <Tabs defaultActiveKey="staff" className="report-tabs">
        {/* STAFF TAB */}
        <TabPane
          tab={
            <span>
              <UserOutlined /> Staff Report
            </span>
          }
          key="staff"
        >
          <Card className="report-card">
            <div className="report-header">
              <div className="header-left">
                <h3>
                  <UserOutlined /> Staff Report ({formatDate(staffFrom)} to{" "}
                  {formatDate(staffTo)})
                </h3>
                <Text type="secondary">
                  Total Records: {staff?.length || 0}
                </Text>
              </div>

              <Row gutter={12} align="middle">
                <Col xs={24} lg={8} className="py-3">
                  <Row gutter={8}>
                    <Col xs={12}>
                      <Calender
                        setLabel={setStaffFrom}
                        calenderlabel="From Date"
                        initialDate={staffFrom}
                      />
                    </Col>
                    <Col xs={12}>
                      <Calender
                        setLabel={setStaffTo}
                        calenderlabel="To Date"
                        initialDate={staffTo}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} lg={16}>
                  <Row gutter={12} justify="end" align="middle">
                    <Col flex="200px" xs={24} sm={12} md={8}>
                      <Input
                        placeholder="Search staff..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={staffSearchText}
                        onChange={(e) =>
                          handleStaffSearchChange(e.target.value)
                        }
                      />
                    </Col>
                    <Col flex="none" xs={24} sm={12} md={6}>
                      <Button
                        type="primary"
                        icon={<FileExcelOutlined />}
                        onClick={handleStaffExcelDownload}
                        style={{ marginRight: 8 }}
                      >
                        Excel
                      </Button>
                      <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={handleStaffPDFDownload}
                      >
                        PDF
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Table
              columns={staffColumns}
              dataSource={staff}
              rowKey={(r) => `${r.report_date}_${r.name}`}
              pagination={false}
              bordered
              scroll={{ x: 800 }}
              size="middle"
              className="professional-table"
              footer={() => tableFooter(staffTotal)}
            />
          </Card>
        </TabPane>

        {/* MEMBER TAB */}
        <TabPane
          tab={
            <span>
              <TeamOutlined /> Member Report
            </span>
          }
          key="member"
        >
          <Card className="report-card">
            <div className="report-header">
              <div className="header-left">
                <h3>
                  <TeamOutlined /> Member Report ({formatDate(memberFrom)} to{" "}
                  {formatDate(memberTo)})
                </h3>
                <Text type="secondary">
                  Total Records: {member?.length || 0}
                </Text>
              </div>
              <Row gutter={12} align="middle">
                <Col xs={24} lg={8} className="py-3">
                  <Row gutter={8}>
                    <Col xs={12}>
                      <Calender
                        setLabel={setMemberFrom}
                        calenderlabel="From Date"
                        initialDate={memberFrom}
                      />
                    </Col>
                    <Col xs={12}>
                      <Calender
                        setLabel={setMemberTo}
                        calenderlabel="To Date"
                        initialDate={memberTo}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} lg={16}>
                  <Row gutter={12} justify="end" align="middle">
                    <Col flex="200px" xs={24} sm={12} md={8}>
                      <Input
                        placeholder="Search members..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={memberSearchText}
                        onChange={(e) =>
                          handleMemberSearchChange(e.target.value)
                        }
                      />
                    </Col>
                    <Col flex="none" xs={24} sm={12} md={6}>
                      <Button
                        type="primary"
                        icon={<FileExcelOutlined />}
                        onClick={handleMemberExcelDownload}
                        style={{ marginRight: 8 }}
                      >
                        Excel
                      </Button>
                      <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        onClick={handleMemberPDFDownload}
                      >
                        PDF
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Table
              columns={memberColumns}
              dataSource={member}
              rowKey={(r) => `${r.report_date}_${r.member_no}`}
              pagination={false}
              bordered
              scroll={{ x: 1000 }}
              size="middle"
              className="professional-table"
              footer={() => tableFooter(memberTotal, "Overall Total")}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardReports;
