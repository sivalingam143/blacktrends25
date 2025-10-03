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
import { useDispatch, useSelector } from "react-redux";
import { TextInputform, DropDown } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import { fetchMembers } from "../../slice/MemberSlice";
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
    last_visit_date: new Date().toISOString().split("T")[0],
    total_visit_count: 0,
    total_spending: 0,
    membership: "No",
    created_by_id: 1,
    updated_by_id: 1,
    billing_id: "",
  });
  const [rows, setRows] = useState([]); // Dynamic rows for products/services
  const [subtotal, setSubtotal] = useState(0);
  const [overall_discount, setOverallDiscount] = useState(0);
  const [discount_type, setDiscountType] = useState("INR"); // INR or PER
  const [grand_total, setGrandTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);

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

  const handleMemberChange = (selectedOption) => {
    if (selectedOption) {
      const selectedMember = member.find(
        (m) => m.phone === selectedOption.value
      );
      if (selectedMember) {
        setForm((prev) => ({
          ...prev,
          member_no: selectedMember.member_no,
          name: selectedMember.name,
          phone: selectedMember.phone,
          membership: selectedMember.gold_membership || "No",
        }));
      }
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
        row.row_total =
          (row.qty || 1) * row.product_price - (row.discount || 0);
      } else if (field === "staff_ids") {
        // Multi-select for staff
        row.staff_ids = value ? value.map((v) => v.value) : [];
        row.staff_names = value ? value.map((v) => v.label).join(", ") : "";
      } else if (field === "qty" || field === "discount") {
        row[field] = parseFloat(value) || 0;
        row.row_total = row.qty * row.product_price - row.discount;
      }

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
        staff_ids: [],
        staff_names: "",
        row_total: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhoneInputChange = (e) => {
    const phoneValue = e.target.value;
    setForm((prev) => ({ ...prev, phone: phoneValue }));

    // Check if phone matches existing member
    if (phoneValue.length === 10) {
      const selectedMember = member.find((m) => m.phone === phoneValue);
      if (selectedMember) {
        setForm((prev) => ({
          ...prev,
          member_no: selectedMember.member_no,
          name: selectedMember.name,
          membership: selectedMember.gold_membership || "No",
        }));
        NotifyData("Member found and details loaded!", "success");
      } else {
        // New phone, keep as is
        setForm((prev) => ({
          ...prev,
          member_no: "",
          name: "",
          membership: "No",
        }));
      }
    }
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (
      !form.member_no ||
      !form.name ||
      !form.phone ||
      rows.length === 0 ||
      rows.some((r) => !r.product_id)
    ) {
      NotifyData(
        "Required fields missing (select at least one product/service)",
        "error"
      );
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      productandservice_details: JSON.stringify(
        rows.map((r) => ({
          product_id: r.product_id,
          qty: r.qty,
          discount: r.discount,
          staff_ids: r.staff_ids, // Array of staff IDs
          total: r.row_total,
        }))
      ),
      subtotal,
      discount: overall_discount,
      total: grand_total,
      ...(isEdit && { billing_id: id }),
    };

    try {
      const action = isEdit ? updateBilling(payload) : addBilling(payload);
      const msg = await dispatch(action).unwrap();
      NotifyData(msg, "success");
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
        {/* Container 1: Date, Phone, Name */}
        <Row className="mb-4 border p-3 rounded">
          <Col md={4}>
            <TextInputform
              formLabel="Date *"
              PlaceHolder="YYYY-MM-DD"
              name="billing_date"
              formtype="date"
              value={form.billing_date}
              onChange={handleFormChange}
            />
          </Col>
          <Col md={4}>
            <TextInputform
              formLabel="Phone *"
              PlaceHolder="Type phone number"
              name="phone"
              value={form.phone}
              onChange={handlePhoneInputChange}
            />
          </Col>
          <Col md={4}>
            <TextInputform
              formLabel="Name *"
              PlaceHolder="Name"
              name="name"
              value={form.name}
              disabled={true}
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
                        formtype="number"
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
                          formtype="number"
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
                      formtype="number"
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
                <div className="mb-2">
                  <TextInputform
                    formLabel="Last Visit Date"
                    PlaceHolder="YYYY-MM-DD"
                    name="last_visit_date"
                    formtype="date"
                    value={form.last_visit_date}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="mb-2">
                  <TextInputform
                    formLabel="Total Visit Count"
                    PlaceHolder="0"
                    name="total_visit_count"
                    formtype="number"
                    value={form.total_visit_count}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <TextInputform
                    formLabel="Total Spending"
                    PlaceHolder="0.00"
                    name="total_spending"
                    formtype="number"
                    step="0.01"
                    value={form.total_spending}
                    onChange={handleFormChange}
                  />
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
