import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Card, Input, Table, Typography } from "antd";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchMembers } from "../../slice/MemberSlice";
import { SearchOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import "./Dashboard.css";
const { TabPane } = Tabs;
const { Text } = Typography;

const DashboardReports = () => {
  const dispatch = useDispatch();
  const [staffSearchText, setStaffSearchText] = useState("");
  const [memberSearchText, setMemberSearchText] = useState("");

  const {
    staff,
    status: staffStatus,
    error: staffError,
  } = useSelector((state) => state.staff);
  const {
    member,
    status: memberStatus,
    error: memberError,
  } = useSelector((state) => state.member);

  useEffect(() => {
    dispatch(fetchStaff(""));
    dispatch(fetchMembers(""));
  }, [dispatch]);

  // Filtered data
  const filteredStaff = staff?.filter(
    (item) =>
      item.name
        .toString()
        .toLowerCase()
        .includes(staffSearchText.toLowerCase()) ||
      item.phone
        .toString()
        .toLowerCase()
        .includes(staffSearchText.toLowerCase())
  );

  const filteredMembers = member?.filter(
    (item) =>
      item.name
        .toString()
        .toLowerCase()
        .includes(memberSearchText.toLowerCase()) ||
      item.phone
        .toString()
        .toLowerCase()
        .includes(memberSearchText.toLowerCase())
  );

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
  ];

  return (
    <div className="dashboard-container" id="main">
      <Tabs defaultActiveKey="staff" className="report-tabs">
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
                  <UserOutlined /> Staff Report
                </h3>
                <Text type="secondary" className="record-count">
                  Total Records: {staff?.length || 0} | Filtered:{" "}
                  {filteredStaff?.length || 0}
                </Text>
              </div>
              <Input
                placeholder="Search staff by name or phone..."
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 300 }}
                value={staffSearchText}
                onChange={(e) => setStaffSearchText(e.target.value)}
              />
            </div>
            {staffStatus === "loading" ? (
              <p className="text-center py-3">Loading...</p>
            ) : staffStatus === "failed" ? (
              <p className="text-center text-danger py-3">
                {staffError || "Error loading staff"}
              </p>
            ) : (
              <Table
                columns={staffColumns}
                dataSource={filteredStaff}
                rowKey="staff_id"
                pagination={false}
                bordered
                className="professional-table"
                scroll={{ x: 600 }}
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
                  <TeamOutlined /> Member Report
                </h3>
                <Text type="secondary" className="record-count">
                  Total Records: {member?.length || 0} | Filtered:{" "}
                  {filteredMembers?.length || 0}
                </Text>
              </div>
              <Input
                placeholder="Search members by name or phone..."
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 300 }}
                value={memberSearchText}
                onChange={(e) => setMemberSearchText(e.target.value)}
              />
            </div>
            {memberStatus === "loading" ? (
              <p className="text-center py-3">Loading...</p>
            ) : memberStatus === "failed" ? (
              <p className="text-center text-danger py-3">
                {memberError || "Error loading members"}
              </p>
            ) : (
              <Table
                columns={memberColumns}
                dataSource={filteredMembers}
                rowKey="member_id"
                pagination={false}
                bordered
                className="professional-table"
                scroll={{ x: 600 }}
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
