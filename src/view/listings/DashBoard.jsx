import React, { useEffect, useState, useMemo } from "react";
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
import { fetchStaff } from "../../slice/StaffSlice";
import { Select } from "antd";

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
  const [selectedStaff, setSelectedStaff] = useState("all");



  const {
    staffReport: staff1,
    memberReport: member,
    status,
    error,
  } = useSelector((state) => state.billing);
  const { staff } = useSelector((state) => state.staff);
  console.log("Staff Data:", staff);


  const filteredMembers = useMemo(() => {
    if (!member) return [];

    // ✅ Apply staff filter
    let filtered = member;
    if (selectedStaff && selectedStaff !== "all") {
      filtered = filtered.filter((m) =>
        m.staff_summary?.some((s) => s.staff_id === selectedStaff)
      );
    }

    // ✅ Apply search text filter (if applicable)
    if (memberSearchText) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(memberSearchText.toLowerCase()) ||
          m.member_no.toLowerCase().includes(memberSearchText.toLowerCase()) ||
          (m.phone + "").includes(memberSearchText)
      );
    }

    return filtered;
  }, [member, selectedStaff, memberSearchText]);


  // Calculate totals
  const staffTotal = staff1.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );
  // const memberTotal = member.reduce(
  //   (sum, item) => sum + (parseFloat(item.daily_total) || 0),
  //   0
  // );
  // const memberCashTotal = member.reduce(
  //   (sum, item) => sum + (parseFloat(item.cash) || 0),
  //   0
  // );
  // const memberGPayTotal = member.reduce(
  //   (sum, item) => sum + (parseFloat(item.gpay) || 0),
  //   0
  // );
  const memberCashTotal = useMemo(() => {
    return filteredMembers.reduce((sum, m) => sum + (parseFloat(m.cash) || 0), 0);
  }, [filteredMembers]);

  const memberGPayTotal = useMemo(() => {
    return filteredMembers.reduce((sum, m) => sum + (parseFloat(m.gpay) || 0), 0);
  }, [filteredMembers]);

  const memberTotal = useMemo(() => {
    if (selectedStaff && selectedStaff !== "all") {
      // 🔹 Staff-specific total
      return filteredMembers.reduce((sum, m) => {
        const staffData = m.staff_summary?.find(
          (s) => s.staff_id === selectedStaff
        );
        return sum + (staffData ? parseFloat(staffData.total) : 0);
      }, 0);
    } else {
      // 🔹 All-staff total (as before)
      return filteredMembers.reduce(
        (sum, m) => sum + (parseFloat(m.daily_total) || 0),
        0
      );
    }
  }, [filteredMembers, selectedStaff]);


  console.log("Filtered Members:", filteredMembers);



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
      dispatch(fetchStaff(""));
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
    downloadStaffExcel(staff1, staffFrom, staffTo, staffColumns);
  };

  const handleStaffPDFDownload = () => {
    downloadStaffPDF(staff1, staffFrom, staffTo);
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
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      align: "right",
      sorter: (a, b) => (parseFloat(a.cash) || 0) - (parseFloat(b.cash) || 0),
      render: (c) => `₹${(parseFloat(c) || 0).toFixed(2)}`,
    },
    {
      title: "GPay",
      dataIndex: "gpay",
      key: "gpay",
      align: "right",
      sorter: (a, b) => (parseFloat(a.gpay) || 0) - (parseFloat(b.gpay) || 0),
      render: (g) => `₹${(parseFloat(g) || 0).toFixed(2)}`,
    },
    {
      title: "Total Spending",
      dataIndex: "daily_total",
      key: "todaily_totaltal",
      align: "right",
      sorter: (a, b) => a.daily_total - b.daily_total,
      render: (t) => `₹${(parseFloat(t) || 0).toFixed(2)}`,
    },
    {
    title: "Service Provider",
    dataIndex: "staff_summary",
    key: "staff_summary",
    align: "left",
    render: (staff_summary) => {
      if (!staff_summary || !Array.isArray(staff_summary) || staff_summary.length === 0) {
        return <span style={{ color: "#999" }}>No Staff</span>;
      }

      // ✅ Apply staff filter to this cell
      const filteredStaff =
        selectedStaff && selectedStaff !== "all"
          ? staff_summary.filter((s) => s.staff_id === selectedStaff)
          : staff_summary;

      if (filteredStaff.length === 0) {
        return <span style={{ color: "#999" }}>No matching staff</span>;
      }

      return filteredStaff.map((s) => (
        <div key={s.staff_id}>
          {s.staff_name} — <b>₹{parseFloat(s.total).toFixed(2)}</b>
        </div>
      ));
    },
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

  const memberTableFooter = () => (
    <div
      style={{
        textAlign: "right",
        padding: "8px",
        borderTop: "1px solid #d9d9d9",
        backgroundColor: "#f9f9f9",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        Overall Cash: ₹{memberCashTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
      <div style={{ fontWeight: "bold" }}>
        Overall GPay: ₹{memberGPayTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
      <div style={{ fontWeight: "bold" }}>
        Overall Total: ₹{memberTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
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
                  Total Records: {staff1?.length || 0}
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

                    <Col span={24} style={{ marginTop: 8 }}>
                      <Row gutter={8}>
                        {/* ✅ Set Today Button */}
                        <Col xs={12}>
                          <Button
                            type="default"
                            onClick={() => {
                              const today = moment().format("YYYY-MM-DD");
                              setStaffFrom(today);
                              setStaffTo(today);
                            }}
                            block
                          >
                            Set Today
                          </Button>
                        </Col>

                        {/* ✅ Reset Button */}
                        <Col xs={12}>
                          <Button
                            type="dashed"
                            onClick={() => {
                              const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
                              const today = moment().format("YYYY-MM-DD");
                              setStaffFrom(startOfYear);
                              setStaffTo(today);
                            }}
                            block
                          >
                            Reset
                          </Button>
                        </Col>
                      </Row>
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
              dataSource={staff1}
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
                    <Col span={24} style={{ marginTop: 8 }}>
                      <Row gutter={8}>
                        {/* ✅ Set Today Button */}
                        <Col xs={12}>
                          <Button
                            type="default"
                            onClick={() => {
                              const today = moment().format("YYYY-MM-DD");
                              setMemberFrom(today);
                              setMemberTo(today);
                            }}
                            block
                          >
                            Set Today
                          </Button>
                        </Col>

                        {/* ✅ Reset Button */}
                        <Col xs={12}>
                          <Button
                            type="dashed"
                            onClick={() => {
                              const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
                              const today = moment().format("YYYY-MM-DD");

                              setMemberFrom(startOfYear);
                              setMemberTo(today);
                            }}
                            block
                          >
                            Reset
                          </Button>
                        </Col>

                      </Row>
                    </Col>

                  </Row>
                </Col>

                <Col xs={24} lg={16}>
                  <Row gutter={12} justify="end" align="middle">
                    <Col flex="160px" xs={24} sm={12} md={6}>
                      <Select
                        allowClear
                        placeholder="Filter by Staff"
                        value={selectedStaff}
                        onChange={(value) => setSelectedStaff(value)}
                        style={{ width: "100%" }}
                        options={[
                          { label: "All Staff", value: "all" },
                          ...staff.map((s) => ({
                            label: s.name,
                            value: s.staff_id,
                          })),
                        ]}
                        showSearch
                        optionFilterProp="label"
                      />
                    </Col>
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
              dataSource={filteredMembers}
              rowKey={(r) => `${r.report_date}_${r.member_no}`}
              pagination={false}
              bordered
              scroll={{ x: 1200 }}
              size="middle"
              className="professional-table"
              footer={memberTableFooter}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardReports;
