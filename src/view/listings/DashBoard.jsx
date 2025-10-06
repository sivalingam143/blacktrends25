import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Card, Input, Table } from "antd";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchMembers } from "../../slice/MemberSlice";
import "./Dashboard.css";
const { TabPane } = Tabs;

const DashboardReports = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

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
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredMembers = member?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const staffColumns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (_, __, i) => i + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (t) => t || "-",
    },
  ];

  const memberColumns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (_, __, i) => i + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Gold Membership",
      dataIndex: "membership",
      key: "membership",
      render: (m) => (m === "Yes" ? "Yes ✅" : "No ❌"),
    },
  ];

  return (
    <div className="dashboard-container" id="main">
      <Tabs defaultActiveKey="staff">
        {/* -------- STAFF REPORT TAB -------- */}
        <TabPane tab="Staff Report" key="staff">
          <Card className="report-card">
            <div className="report-header">
              <h3 className="m-0">Staff Report</h3>
              <Input.Search
                placeholder="Search staff..."
                allowClear
                style={{ width: 250 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
              />
            )}
          </Card>
        </TabPane>

        {/* -------- MEMBER REPORT TAB -------- */}
        <TabPane tab="Member Report" key="member">
          <Card className="report-card">
            <div className="report-header">
              <h3 className="m-0">Member Report</h3>
              <Input.Search
                placeholder="Search member..."
                allowClear
                style={{ width: 250 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardReports;
