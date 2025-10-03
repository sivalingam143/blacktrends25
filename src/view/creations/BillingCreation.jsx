import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Form,
  Table,
  Button,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform, DropDown } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import { fetchMembers, addMember } from "../../slice/MemberSlice";
import { fetchProductAndServices } from "../../slice/ProductAndServiceSlice";
import { fetchStaff } from "../../slice/StaffSlice";
import {
  fetchBillings,
  addBilling,
  updateBilling,
} from "../../slice/BillingSlice";

const BillingCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { member } = useSelector((s) => s.member);
  const { billing } = useSelector((s) => s.billing);
  const { productandservice: products } = useSelector(
    (s) => s.productandservice
  );
  const { staff } = useSelector((s) => s.staff);
  const isEdit = !!id;

  const [form, setForm] = useState({
    billing_date: new Date().toISOString().split("T")[0],
    member_no: "",
    name: "",
    phone: "",
    last_visit_date: "",
    total_visit_count: 0,
    total_spending: 0,
    membership: "",
    created_by_id: 1,
    updated_by_id: 1,
    billing_id: "",
  });
  console.log(form);
  const [rows, setRows] = useState([]); // Dynamic rows for products/services
  const [subtotal, setSubtotal] = useState(0);
  const [overall_discount, setOverallDiscount] = useState(0);
  const [discount_type, setDiscountType] = useState("INR"); // INR or PER
  const [grand_total, setGrandTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Phone options for searchable dropdown
  const phoneOptions = member.map((m) => ({
    value: m.phone,
    label: m.phone,
  }));

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    dispatch(fetchMembers(""));
    dispatch(fetchProductAndServices(""));
    dispatch(fetchStaff(""));
    dispatch(fetchBillings(""));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && billing.length) {
      const rec = billing.find((b) => b.billing_id === id);
      if (rec) {
        // Set basic form
        setForm({
          ...rec,
          billing_date: rec.billing_date.split(" ")[0],
          last_visit_date: rec.last_visit_date.split(" ")[0],
          total_visit_count: parseInt(rec.total_visit_count),
          total_spending: parseFloat(rec.total_spending),
        });
        setOverallDiscount(parseFloat(rec.discount));
        setDiscountType("INR"); // Default

        // Parse product details if exists
        let parsedRows = [];
        if (rec.productandservice_details) {
          try {
            const details = JSON.parse(rec.productandservice_details);
            parsedRows = details.map((detail) => {
              const product = products.find(
                (p) => p.productandservice_id === detail.product_id
              );
              const staffItems = detail.staff_ids
                ? staff.filter((st) => detail.staff_ids.includes(st.staff_id))
                : [];
              const rowTotal =
                detail.qty * (product?.productandservice_price || 0) -
                detail.discount;
              return {
                product_id: detail.product_id,
                product_name: product?.productandservice_name || "",
                product_price: product?.productandservice_price || 0,
                qty: detail.qty,
                discount: detail.discount,
                discount_type: detail.discount_type || "INR",
                staff_ids: detail.staff_ids || [], // Array for multiple
                staff_names: staffItems.map((st) => st.name).join(", "),
                row_total: rowTotal,
              };
            });
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
        setRows(parsedRows);
      }
    }
  }, [id, billing, isEdit, products, staff]);

  // Recalculate totals
  useEffect(() => {
    const newSubtotal = rows.reduce((sum, row) => sum + row.row_total, 0);
    setSubtotal(newSubtotal);
    let discountAmount = 0;
    if (discount_type === "PER") {
      discountAmount = (overall_discount / 100) * newSubtotal;
    } else {
      discountAmount = overall_discount;
    }
    setGrandTotal(newSubtotal - discountAmount);
  }, [rows, overall_discount, discount_type]);

  const phoneValue = form.phone
    ? phoneOptions.find((opt) => opt.value === form.phone) || {
        value: form.phone,
        label: form.phone,
      }
    : null;

  const handleMemberChange = (selectedOption) => {
    if (selectedOption) {
      const selectedMember = member.find(
        (m) => m.phone === selectedOption.value
      );
      if (selectedMember) {
        // existing member
        setForm((prev) => ({
          ...prev,
          member_no: selectedMember.member_no,
          name: selectedMember.name,
          phone: selectedMember.phone,
          membership: selectedMember.gold_membership || "",
          last_visit_date: selectedMember.last_visit_date
            ? selectedMember.last_visit_date.split(" ")[0]
            : "",
          total_visit_count: selectedMember.total_visit_count || 0,
          total_spending: selectedMember.total_spending || 0,
        }));
        NotifyData("Member found and details loaded!", "success");
      } else {
        // new phone
        setForm((prev) => ({
          ...prev,
          member_no: "",
          name: "",
          phone: selectedOption.value,
          membership: "",
          last_visit_date: "",
          total_visit_count: 0,
          total_spending: 0,
        }));
        NotifyData("New member - please enter name", "info");
      }
    } else {
      // cleared
      setForm((prev) => ({
        ...prev,
        member_no: "",
        name: "",
        phone: "",
        membership: "",
        last_visit_date: "",
        total_visit_count: 0,
        total_spending: 0,
      }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };

  const handleOverallDiscountChange = (e) => {
    setOverallDiscount(parseFloat(e.target.value) || 0);
  };

  // Handle row changes
  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const newRows = [...prev];
      const row = { ...newRows[index] };

      if (field === "product_id") {
        const selectedProduct = products.find(
          (p) => p.productandservice_id === value
        );
        row.product_id = value;
        row.product_name = selectedProduct?.productandservice_name || "";
        row.product_price = selectedProduct?.productandservice_price || 0;
      } else if (field === "staff_ids") {
        // Multi-select for staff
        row.staff_ids = value ? value.map((v) => v.value) : [];
        row.staff_names = value ? value.map((v) => v.label).join(", ") : "";
      } else if (field === "qty") {
        row.qty = parseFloat(value) || 0;
      } else if (field === "discount") {
        row.discount = parseFloat(value) || 0;
      } else if (field === "discount_type") {
        row.discount_type = value;
      }

      // Recalculate row total
      let discAmount = row.discount || 0;
      if (row.discount_type === "PER") {
        discAmount =
          (row.discount / 100) * (row.qty || 0) * (row.product_price || 0);
      }
      row.row_total = (row.qty || 0) * (row.product_price || 0) - discAmount;

      newRows[index] = row;
      return newRows;
    });
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        product_id: "",
        product_name: "",
        product_price: 0,
        qty: 1,
        discount: 0,
        discount_type: "INR",
        staff_ids: [],
        staff_names: "",
        row_total: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (
      !form.phone ||
      !form.name.trim() ||
      rows.length === 0 ||
      rows.some((r) => !r.product_id)
    ) {
      NotifyData(
        "Required fields missing (enter phone, name, and select at least one product/service)",
        "error"
      );
      setSubmitting(false);
      return;
    }

    try {
      let billingPayload = {
        ...form,
        productandservice_details: JSON.stringify(
          rows.map((r) => ({
            product_id: r.product_id,
            qty: r.qty,
            discount: r.discount,
            discount_type: r.discount_type,
            staff_ids: r.staff_ids,
            total: r.row_total,
          }))
        ),
        subtotal,
        discount: overall_discount,
        total: grand_total,
      };

      // Update stats
      const updatedVisitCount =
        parseInt(billingPayload.total_visit_count || 0) + 1;
      const updatedSpending =
        parseFloat(billingPayload.total_spending || 0) + grand_total;
      billingPayload.last_visit_date = billingPayload.billing_date;
      billingPayload.total_visit_count = updatedVisitCount;
      billingPayload.total_spending = updatedSpending;

      if (isEdit) {
        billingPayload.edit_billing_id = id;
        billingPayload.updated_by_id = 1;
        const msg = await dispatch(updateBilling(billingPayload)).unwrap();
        NotifyData(msg, "success");
      } else {
        if (!billingPayload.member_no) {
          // New member
          const memberPayload = {
            name: billingPayload.name,
            phone: billingPayload.phone,
            gold_membership: billingPayload.membership || "No",
          };
          await dispatch(addMember(memberPayload)).unwrap();
          // Refetch members to get the new one
          const membersData = await dispatch(fetchMembers("")).unwrap();
          const newMember = membersData.member.find(
            (m) =>
              m.phone === billingPayload.phone && m.name === billingPayload.name
          );
          if (!newMember) {
            throw new Error("Failed to create new member");
          }
          // Update payload for billing
          billingPayload.member_no = newMember.member_no;
          billingPayload.created_by_id = 1;
          // For new: set initial stats
          billingPayload.total_visit_count = 1;
          billingPayload.total_spending = grand_total;
          billingPayload.last_visit_date = billingPayload.billing_date;
        } else {
          billingPayload.created_by_id = 1;
        }
        const msg = await dispatch(addBilling(billingPayload)).unwrap();
        NotifyData(msg, "success");
      }
      navigate("/billing");
    } catch (e) {
      NotifyData(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Prepare staff options for multi-select
  const staffOptions = staff.map((st) => ({
    value: st.staff_id,
    label: st.name,
  }));

  // Prepare product options for DropDown
  const productOptions = products.map((p) => ({
    value: p.productandservice_id,
    label: p.productandservice_name,
  }));

  // Prepare discount type options for DropDown
  const discountTypeOptions = [
    { value: "INR", label: "INR" },
    { value: "PER", label: "%" },
  ];

  return (
    <div id="main">
      <Container fluid className="p-3">
        <Row className="mb-4 ">
          <Col md={4} lg={3}>
            <TextInputform
              formLabel="Date *"
              PlaceHolder="YYYY-MM-DD"
              name="billing_date"
              formtype="date"
              value={form.billing_date}
              onChange={handleFormChange}
            />
          </Col>
          <Col md={4} lg={3} className="py-2">
            <label>Phone *</label>
            <CreatableSelect
              options={phoneOptions}
              isSearchable={true}
              placeholder="Type to search or enter new phone"
              value={phoneValue}
              onChange={handleMemberChange}
              formatCreateLabel={(inputValue) =>
                `Use ${inputValue} as new phone`
              }
            />
          </Col>
          <Col md={4} lg={3}>
            <TextInputform
              formLabel="Name *"
              PlaceHolder="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              disabled={!!form.member_no}
            />
          </Col>
        </Row>

        {/* Main Row: Left 3 Containers, Right Stats */}
        <Row className="mb-4">
          {/* Left: Container 2 - Product/Service Table - Full Width */}
          <Col md={12}>
            <Table className="mb-3">
              <thead>
                <tr>
                  <th>Product/Service Dropdown</th>
                  <th>Qty</th>
                  <th>Discount</th>
                  <th>Service Provider Dropdown (Multiple)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <DropDown
                        placeholder="Select Product/Service"
                        value={row.product_id}
                        onChange={(e) =>
                          handleRowChange(index, "product_id", e.target.value)
                        }
                        options={productOptions}
                        style={{ width: "20px" }}
                      />
                    </td>
                    <td>
                      <TextInputform
                        formtype="text"
                        PlaceHolder="Qty"
                        value={row.qty}
                        onChange={(e) =>
                          handleRowChange(index, "qty", e.target.value)
                        }
                        style={{ width: "40px" }}
                      />
                    </td>
                    <td>
                      <div className="d-flex">
                        <DropDown
                          placeholder="Type"
                          value={row.discount_type || "INR"}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "discount_type",
                              e.target.value
                            )
                          }
                          options={discountTypeOptions}
                          style={{ width: "40px" }}
                        />
                        <TextInputform
                          formtype="text"
                          step="0.01"
                          PlaceHolder="Amount"
                          value={row.discount}
                          onChange={(e) =>
                            handleRowChange(index, "discount", e.target.value)
                          }
                          style={{ width: "60px" }}
                        />
                      </div>
                    </td>
                    <td>
                      <Select
                        isMulti
                        options={staffOptions}
                        value={staffOptions.filter((opt) =>
                          row.staff_ids.includes(opt.value)
                        )}
                        onChange={(selected) =>
                          handleRowChange(index, "staff_ids", selected)
                        }
                        placeholder="Select Staff (Multiple)"
                      />
                    </td>
                    <td>₹{row.row_total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="primary" onClick={addRow}>
              Add Row
            </Button>
          </Col>
        </Row>

        {/* Row for Totals and Stats */}
        <Row className="mb-4">
          {/* Container 3: Subtotal, Discount, Total - Vertical */}
          <Col md={8}>
            <Card>
              <Card.Header>Totals</Card.Header>
              <Card.Body className="p-3">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <strong>Subtotal</strong>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    <label>Discount</label>
                    <div className="d-flex">
                      <DropDown
                        placeholder="Type"
                        value={discount_type}
                        onChange={handleDiscountTypeChange}
                        options={discountTypeOptions}
                        style={{ width: "80px" }}
                      />
                    </div>
                  </div>
                  <div className="input-group" style={{ width: "150px" }}>
                    <TextInputform
                      formtype="text"
                      step="0.01"
                      PlaceHolder="Amount"
                      value={overall_discount}
                      onChange={handleOverallDiscountChange}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                  <strong>Total</strong>
                  <span>₹{grand_total.toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Stats Container - Compact for 3 Fields */}
          <Col md={4}>
            <Card className="h-100">
              <Card.Header>Member Status</Card.Header>
              <Card.Body className="p-2">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <strong>Last Visit Date</strong>
                  <span>{formatDate(form.last_visit_date)}</span>
                </div>
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <strong>Total Visit Count</strong>
                  <span>{form.total_visit_count || 0}</span>
                </div>
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <strong>Total Spending</strong>
                  <span>₹{(form.total_spending || 0).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Membership</strong>
                  <span>{form.membership || "-"}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Submit Buttons */}
        <Row>
          <Col md={12} className="text-center">
            <Buttons
              btnlabel={
                submitting
                  ? isEdit
                    ? "Updating…"
                    : "Adding…"
                  : isEdit
                  ? "Update"
                  : "Create"
              }
              className="border-0 submit-btn me-3"
              onClick={submit}
              disabled={submitting}
            />
            <Buttons
              btnlabel="Cancel"
              className="border-0 add-btn"
              onClick={() => navigate("/billing")}
              disabled={submitting}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BillingCreation;
