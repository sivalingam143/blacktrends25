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
import { useDispatch, useSelector } from "react-redux";
import { TextInputform } from "../../components/Forms";
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

        // Parse product details if exists
        let parsedRows = [];
        if (rec.productandservice_details) {
          try {
            const details = JSON.parse(rec.productandservice_details);
            parsedRows = details.map((detail) => {
              const product = products.find(
                (p) => p.productandservice_id === detail.product_id
              );
              const staffItem = staff.find(
                (st) => st.staff_id === detail.staff_id
              );
              const rowTotal =
                detail.qty * (product?.productandservice_price || 0) -
                detail.discount;
              return {
                product_id: detail.product_id,
                product_name: product?.productandservice_name || "",
                product_price: product?.productandservice_price || 0,
                qty: detail.qty,
                discount: detail.discount,
                staff_id: detail.staff_id,
                staff_name: staffItem?.name || "",
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
    setGrandTotal(newSubtotal - overall_discount);
  }, [rows, overall_discount]);

  const handleMemberChange = (e) => {
    const selectedNo = e.target.value;
    setForm((prev) => {
      const selectedMember = member.find((m) => m.member_no === selectedNo);
      return {
        ...prev,
        member_no: selectedNo,
        name: selectedMember ? selectedMember.name : "",
        phone: selectedMember ? selectedMember.phone : "",
        membership: selectedMember ? selectedMember.gold_membership : "No",
      };
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        // Recalc total with default qty=1, discount=0 if new
        row.row_total =
          (row.qty || 1) * row.product_price - (row.discount || 0);
      } else if (field === "staff_id") {
        const selectedStaff = staff.find((st) => st.staff_id === value);
        row.staff_id = value;
        row.staff_name = selectedStaff?.name || "";
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
        staff_id: "",
        staff_name: "",
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
          staff_id: r.staff_id,
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
            <Form.Group>
              <Form.Label>Phone *</Form.Label>
              <Form.Select
                name="member_no"
                value={form.member_no}
                onChange={handleMemberChange}
              >
                <option value="">Select Phone</option>
                {member.map((m) => (
                  <option key={m.member_no} value={m.member_no}>
                    {m.phone}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
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
          {/* Left: Container 2 - Product/Service Table */}
          <Col md={8}>
            <Card className="mb-3">
              <Card.Header>Product and Service Details Table</Card.Header>
              <Card.Body>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Product/Service Dropdown</th>
                      <th>Qty</th>
                      <th>Discount</th>
                      <th>Service Provider Dropdown</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Select
                            value={row.product_id}
                            onChange={(e) =>
                              handleRowChange(
                                index,
                                "product_id",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Product/Service</option>
                            {products.map((p) => (
                              <option
                                key={p.productandservice_id}
                                value={p.productandservice_id}
                              >
                                {p.productandservice_name}
                              </option>
                            ))}
                          </Form.Select>
                          <small>{row.product_name}</small>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.qty}
                            onChange={(e) =>
                              handleRowChange(index, "qty", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={row.discount}
                            onChange={(e) =>
                              handleRowChange(index, "discount", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Select
                            value={row.staff_id}
                            onChange={(e) =>
                              handleRowChange(index, "staff_id", e.target.value)
                            }
                          >
                            <option value="">Select Staff</option>
                            {staff.map((st) => (
                              <option key={st.staff_id} value={st.staff_id}>
                                {st.name}
                              </option>
                            ))}
                          </Form.Select>
                          <small>{row.staff_name}</small>
                        </td>
                        <td>₹{row.row_total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="primary" onClick={addRow}>
                  Add Row
                </Button>
              </Card.Body>
            </Card>

            {/* Container 3: Subtotal, Discount, Total - Vertical */}
            <Card>
              <Card.Header>Totals</Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Subtotal: ₹{subtotal.toFixed(2)}</strong>
                </div>
                <div className="mb-3">
                  <TextInputform
                    formLabel="Discount"
                    PlaceHolder="0.00"
                    name="overall_discount"
                    formtype="number"
                    step="0.01"
                    value={overall_discount}
                    onChange={handleOverallDiscountChange}
                  />
                </div>
                <div>
                  <strong>Total: ₹{grand_total.toFixed(2)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Stats Container - Only for 3 Fields */}
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
                    size="sm"
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
                    size="sm"
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
                    size="sm"
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
