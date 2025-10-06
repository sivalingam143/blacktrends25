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
  Select,
} from "antd";
import { fetchStaffReport, fetchMemberReport } from "../../slice/BillingSlice";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchMembers } from "../../slice/MemberSlice";
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "./Dashboard.css";
const { TabPane } = Tabs;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardReports = () => {
  const dispatch = useDispatch();
  const [staffSearchText, setStaffSearchText] = useState("");
  const [memberSearchText, setMemberSearchText] = useState("");
  const [dateRange, setDateRange] = useState([
    moment().startOf("year"),
    moment(),
  ]); // Default to start of year to today

  const {
    staffReport: staff,
    memberReport: member,
    status,
    error,
  } = useSelector((state) => state.billing);

  const staffList = useSelector((state) => state.staff.staff || []);
  const memberList = useSelector((state) => state.member.member || []);

  const fromDate = dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : "";
  const toDate = dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : "";

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    if (fromDate && toDate) {
      dispatch(
        fetchStaffReport({ fromDate, toDate, searchText: staffSearchText })
      );
      dispatch(
        fetchMemberReport({ fromDate, toDate, searchText: memberSearchText })
      );
    }
  }, [dispatch, fromDate, toDate]);

  const handleDateChange = (dates) => {
    setDateRange(dates || [moment().startOf("year"), moment()]);
  };

  const handleStaffSearchChange = (value) => {
    setStaffSearchText(value);
    if (fromDate && toDate) {
      dispatch(fetchStaffReport({ fromDate, toDate, searchText: value }));
    }
  };

  const handleMemberSearchChange = (value) => {
    setMemberSearchText(value);
    if (fromDate && toDate) {
      dispatch(fetchMemberReport({ fromDate, toDate, searchText: value }));
    }
  };

  // Table columns with alignment and sorting
  const staffColumns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      width: 80,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Date",
      dataIndex: "report_date",
      key: "report_date",
      width: 120,
      align: "center",
      sorter: (a, b) => new Date(b.report_date) - new Date(a.report_date),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      align: "left",
      sorter: (a, b) => a.name.toString().localeCompare(b.name.toString()),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      align: "center",
      sorter: (a, b) => a.phone.toString().localeCompare(b.phone.toString()),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      align: "left",
      render: (t) => t || "-",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      ellipsis: true,
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
      width: 80,
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Date",
      dataIndex: "report_date",
      key: "report_date",
      width: 120,
      align: "center",
      sorter: (a, b) => new Date(b.report_date) - new Date(a.report_date),
    },
    {
      title: "Member No",
      dataIndex: "member_no",
      key: "member_no",
      width: 120,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      align: "left",
      sorter: (a, b) => a.name.toString().localeCompare(b.name.toString()),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      align: "center",
      sorter: (a, b) => a.phone.toString().localeCompare(b.phone.toString()),
    },
    {
      title: "Gold Membership",
      dataIndex: "membership",
      key: "membership",
      width: 150,
      align: "center",
      sorter: (a, b) =>
        a.membership.toString().localeCompare(b.membership.toString()),
      render: (m) => (m === "Yes" ? "Yes ✅" : "No ❌"),
    },
    {
      title: "Last Visit Date",
      dataIndex: "last_visit_date",
      key: "last_visit_date",
      ellipsis: true,
      align: "left",
      render: (t) => t || "-",
    },
    {
      title: "Visit Count",
      dataIndex: "total_visit_count",
      key: "total_visit_count",
      ellipsis: true,
      align: "center",
      render: (t) => t || "-",
    },
    {
      title: "Total Spending",
      dataIndex: "total_spending",
      key: "total_spending",
      ellipsis: true,
      align: "right",
      sorter: (a, b) => a.total_spending - b.total_spending,
      render: (t) => `₹${t || 0}`,
    },
    {
      title: "Daily Total",
      dataIndex: "daily_total",
      key: "daily_total",
      ellipsis: true,
      align: "right",
      sorter: (a, b) => a.daily_total - b.daily_total,
      render: (t) => `₹${t || 0}`,
    },
  ];

  return (
    <div className="dashboard-container" id="main">
      <Tabs defaultActiveKey="staff" className="report-tabs">
        {/* -------- DATE RANGE PICKER SHARED -------- */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Text strong>
              <CalendarOutlined /> Select Date Range:{" "}
            </Text>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />
          </Col>
        </Row>

        {/* -------- STAFF REPORT TAB -------- */}
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
                <h3 className="m-0">
                  <UserOutlined /> Staff Report ({fromDate} to {toDate})
                </h3>
                <Text type="secondary" className="record-count">
                  Total Records: {staff?.length || 0}
                </Text>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  placeholder="Search staff by name..."
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: 200 }}
                  value={staffSearchText}
                  onChange={(e) => handleStaffSearchChange(e.target.value)}
                />
                <Select
                  placeholder="Select Staff"
                  style={{ width: 200 }}
                  onChange={handleStaffSearchChange}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  value={staffSearchText}
                >
                  {staffList.map((s) => (
                    <Option key={s.staff_id || s.id} value={s.name}>
                      {s.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {status === "loading" ? (
              <p className="text-center py-3">Loading...</p>
            ) : status === "failed" ? (
              <p className="text-center text-danger py-3">
                {error || "Error loading staff report"}
              </p>
            ) : !fromDate || !toDate ? (
              <p className="text-center py-3">
                Please select a date range to view reports.
              </p>
            ) : (
              <Table
                columns={staffColumns}
                dataSource={staff}
                rowKey={(record) => `${record.report_date}_${record.name}`}
                pagination={false}
                bordered
                className="professional-table"
                scroll={{ x: 800 }}
                size="middle"
              />
            )}
          </Card>
        </TabPane>

        {/* -------- MEMBER REPORT TAB -------- */}
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
                <h3 className="m-0">
                  <TeamOutlined /> Member Report ({fromDate} to {toDate})
                </h3>
                <Text type="secondary" className="record-count">
                  Total Records: {member?.length || 0}
                </Text>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  placeholder="Search members by name, phone..."
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: 200 }}
                  value={memberSearchText}
                  onChange={(e) => handleMemberSearchChange(e.target.value)}
                />
                <Select
                  placeholder="Select Member"
                  style={{ width: 200 }}
                  onChange={handleMemberSearchChange}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  value={memberSearchText}
                >
                  {memberList.map((m) => (
                    <Option key={m.id || m.member_id} value={m.name}>
                      {m.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {status === "loading" ? (
              <p className="text-center py-3">Loading...</p>
            ) : status === "failed" ? (
              <p className="text-center text-danger py-3">
                {error || "Error loading member report"}
              </p>
            ) : !fromDate || !toDate ? (
              <p className="text-center py-3">
                Please select a date range to view reports.
              </p>
            ) : (
              <Table
                columns={memberColumns}
                dataSource={member}
                rowKey={(record) => `${record.report_date}_${record.member_id}`}
                pagination={false}
                bordered
                className="professional-table"
                scroll={{ x: 1200 }}
                size="middle"
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardReports;
