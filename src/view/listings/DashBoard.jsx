import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  Tabs,
  Card,
  Input,
  Table,
  Typography,
  DatePicker,
  Row,
  Col,
  Button,
} from "antd";
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
import { formatDate } from "../../components/Forms";
import {
  downloadStaffExcel,
  downloadStaffPDF,
  downloadMemberExcel,
  downloadMemberPDF,
} from "../../pdf/DashboardPdfandExcel";

const { TabPane } = Tabs;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardReports = () => {
  const dispatch = useDispatch();
  const [staffSearchText, setStaffSearchText] = useState("");
  const [memberSearchText, setMemberSearchText] = useState("");
  const [staffDateRange, setStaffDateRange] = useState([
    moment().startOf("year"),
    moment(),
  ]);
  const [memberDateRange, setMemberDateRange] = useState([
    moment().startOf("year"),
    moment(),
  ]);

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

  // STAFF
  const staffFromDate = staffDateRange[0]?.format("YYYY-MM-DD") || "";
  const staffToDate = staffDateRange[1]?.format("YYYY-MM-DD") || "";

  // MEMBER
  const memberFromDate = memberDateRange[0]?.format("YYYY-MM-DD") || "";
  const memberToDate = memberDateRange[1]?.format("YYYY-MM-DD") || "";

  // Fetch reports
  useEffect(() => {
    if (staffFromDate && staffToDate) {
      dispatch(
        fetchStaffReport({
          fromDate: staffFromDate,
          toDate: staffToDate,
          searchText: staffSearchText,
        })
      );
    }
  }, [dispatch, staffFromDate, staffToDate, staffSearchText]);

  useEffect(() => {
    if (memberFromDate && memberToDate) {
      dispatch(
        fetchMemberReport({
          fromDate: memberFromDate,
          toDate: memberToDate,
          searchText: memberSearchText,
        })
      );
    }
  }, [dispatch, memberFromDate, memberToDate, memberSearchText]);

  const handleStaffDateChange = (dates) =>
    setStaffDateRange(dates || [moment().startOf("year"), moment()]);
  const handleMemberDateChange = (dates) =>
    setMemberDateRange(dates || [moment().startOf("year"), moment()]);

  const handleStaffSearchChange = (value) => {
    setStaffSearchText(value);
    if (staffFromDate && staffToDate) {
      dispatch(
        fetchStaffReport({
          fromDate: staffFromDate,
          toDate: staffToDate,
          searchText: value,
        })
      );
    }
  };

  const handleMemberSearchChange = (value) => {
    setMemberSearchText(value);
    if (memberFromDate && memberToDate) {
      dispatch(
        fetchMemberReport({
          fromDate: memberFromDate,
          toDate: memberToDate,
          searchText: value,
        })
      );
    }
  };

  // Download handlers
  const handleStaffExcelDownload = () => {
    downloadStaffExcel(staff, staffFromDate, staffToDate, staffColumns);
  };

  const handleStaffPDFDownload = () => {
    downloadStaffPDF(staff, staffFromDate, staffToDate);
  };

  const handleMemberExcelDownload = () => {
    downloadMemberExcel(member, memberFromDate, memberToDate, memberColumns);
  };

  const handleMemberPDFDownload = () => {
    downloadMemberPDF(member, memberFromDate, memberToDate);
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
      render: (t) => `₹${t || 0}`,
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
      render: (t) => `₹${t || 0}`,
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
      {label}: ₹{total.toLocaleString("en-IN")}
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
                  <UserOutlined /> Staff Report ({staffFromDate} to{" "}
                  {staffToDate})
                </h3>
                <Text type="secondary">
                  Total Records: {staff?.length || 0}
                </Text>
              </div>
              <Row gutter={[12, 12]} justify="end">
                <Col xs={24} sm={12} md={10} lg={6}>
                  <Text strong>
                    <CalendarOutlined /> Date Range:
                  </Text>
                  <RangePicker
                    value={staffDateRange}
                    onChange={handleStaffDateChange}
                    format="DD-MM-YYYY"
                    style={{ width: "100%", marginTop: 4 }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} className="py-4">
                  <Input
                    placeholder="Search staff..."
                    prefix={<SearchOutlined />}
                    allowClear
                    value={staffSearchText}
                    onChange={(e) => handleStaffSearchChange(e.target.value)}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={4} className="py-4">
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
                  <TeamOutlined /> Member Report ({memberFromDate} to{" "}
                  {memberToDate})
                </h3>
                <Text type="secondary">
                  Total Records: {member?.length || 0}
                </Text>
              </div>
              <Row gutter={[12, 12]} justify="end">
                <Col xs={24} sm={12} md={10} lg={6}>
                  <Text strong>
                    <CalendarOutlined /> Date Range:
                  </Text>
                  <RangePicker
                    value={memberDateRange}
                    onChange={handleMemberDateChange}
                    format="DD-MM-YYYY"
                    style={{ width: "100%", marginTop: 4 }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} className="py-4">
                  <Input
                    placeholder="Search members..."
                    prefix={<SearchOutlined />}
                    allowClear
                    value={memberSearchText}
                    onChange={(e) => handleMemberSearchChange(e.target.value)}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={4} className="py-4">
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
