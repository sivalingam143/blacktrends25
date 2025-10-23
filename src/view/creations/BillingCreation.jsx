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
  Modal,
} from "react-bootstrap";
import Select from "react-select";
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
  getMilestoneDiscount,
  clearMilestoneDiscount,
} from "../../slice/BillingSlice";
import { fetchCategories } from "../../slice/CategorySlice";

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
  const { categories } = useSelector((s) => s.categories);
  const { milestoneDiscount: extraDiscountRate } = useSelector(
    (s) => s.billing
  );
  const isEdit = !!id;

  const [form, setForm] = useState({
    billing_date: new Date().toISOString().split("T")[0],
    member_id: "",
    member_no: "",
    name: "",
    phone: "",
    membership: "",
    billing_id: "",
  });
  console.log(form);
  const [rows, setRows] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [overall_discount, setOverallDiscount] = useState(0);
  const [discount_type, setDiscountType] = useState("INR");
  const [grand_total, setGrandTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [payments, setPayments] = useState([]);

  // New Member Modal States
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    phone: "",
    membership: "No",
  });
  const [newMemberSubmitting, setNewMemberSubmitting] = useState(false);

  // Payment method options
  const paymentOptions = [
    { value: "GPay", label: "GPay" },
    { value: "Cash", label: "Cash" },
  ];

  // Phone options for searchable dropdown
  const phoneOptions = member.map((m) => ({
    value: m.phone,
    label: m.phone,
  }));

  // Category options
  const categoryOptions = categories.map((cat) => ({
    value: cat.category_id,
    label: cat.category_name,
  }));

  // Prepare staff options for single-select
  const staffOptions = staff.map((st) => ({
    value: st.staff_id,
    label: st.name,
  }));

  // Prepare discount type options for DropDown
  const discountTypeOptions = [
    { value: "INR", label: "INR" },
    { value: "PER", label: "%" },
  ];
  // New Member Membership Options
  const newMemberMembershipOptions = [
    { value: "No", label: "No" },
    { value: "Yes", label: "Yes" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Update paid based on payments sum
  useEffect(() => {
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    setPaid(totalPaid);
  }, [payments]);

  useEffect(() => {
    dispatch(fetchMembers(""));
    dispatch(fetchProductAndServices(""));
    dispatch(fetchStaff(""));
    dispatch(fetchCategories(""));
    dispatch(fetchBillings(""));
  }, [dispatch]);

  // Edit mode: Parse payment_details if exists
  useEffect(() => {
    if (isEdit && billing.length) {
      const rec = billing.find((b) => b.billing_id === id);
      if (rec) {
        // Set basic form
        setForm({
          ...rec,
          member_id: rec.member_id,
          billing_date: rec.billing_date.split(" ")[0],
        });
        setOverallDiscount(parseFloat(rec.discount));
        setDiscountType(rec.discount_type || "INR");

        // Parse payments if exists
        if (rec.payment_details) {
          try {
            const parsedPayments = JSON.parse(rec.payment_details);
            setPayments(parsedPayments || []);
          } catch (e) {
            console.error("Parse payment_details error:", e);
          }
        }

        // Parse product details if exists
        let parsedRows = [];
        if (rec.productandservice_details) {
          try {
            const details = JSON.parse(rec.productandservice_details);
            parsedRows = details.map((detail) => {
              // Handle both productandservice_id and old product_id for backward compatibility
              const productId =
                detail.productandservice_id || detail.product_id;
              const product = products.find(
                (p) => p.productandservice_id === productId
              );
              // Single staff handling with staff_name from saved data if available
              const staffId = detail.staff_id;
              const savedStaffName = detail.staff_name || "";
              const staffItem = staffId
                ? staff.find((st) => st.staff_id === staffId)
                : null;
              const staffName =
                savedStaffName || (staffItem ? staffItem.name : "");
              // Use the saved row total instead of recalculating to avoid discount type mismatch
              const rowTotal = detail.total || 0;

              // Calculate discount_amount for edit mode
              const rowSubtotal =
                (detail.qty || 0) * (product?.productandservice_price || 0);
              let discAmount = detail.discount || 0;
              if (detail.discount_type === "PER") {
                discAmount = (detail.discount / 100) * rowSubtotal;
              }

              return {
                category_id: detail.category_id || product?.category_id || "",
                product_id: productId,
                product_name:
                  detail.productandservice_name ||
                  product?.productandservice_name ||
                  "",
                product_price:
                  detail.productandservice_price ||
                  product?.productandservice_price ||
                  0,
                qty: detail.qty,
                discount: detail.discount,
                discount_type: detail.discount_type || "INR",
                discount_amount: discAmount,
                staff_id: staffId || null,
                staff_name: staffName,
                row_total: rowTotal,
              };
            });
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
        setRows(parsedRows);
        // If editing and membership is 'Yes', apply 18% default discount to all rows
        if (rec.membership === "Yes") {
          setRows((prevRows) =>
            prevRows.map((row) => {
              const rowSubtotal = (row.qty || 0) * (row.product_price || 0);
              const discAmount = (18 / 100) * rowSubtotal;
              return {
                ...row,
                discount: 18,
                discount_type: "PER",
                discount_amount: discAmount,
              };
            })
          );
        }
      }
    }
  }, [id, billing, isEdit, products, staff, categories]);

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

  // Helper function to apply discounts to rows
  const applyDiscountsToRows = (rowsToUpdate, membership, extraRate) => {
    return rowsToUpdate.map((row) => {
      const rowSubtotal = (row.qty || 0) * (row.product_price || 0);
      let totalDiscount = 0;
      let totalDiscAmount = 0;

      if (membership === "Yes") {
        // Base 18% + extra
        totalDiscount = 18 + extraRate;
      } else if (membership === "No") {
        // Just extra
        totalDiscount = extraRate;
      }

      totalDiscAmount = (totalDiscount / 100) * rowSubtotal;
      const newRowTotal = rowSubtotal - totalDiscAmount;

      return {
        ...row,
        discount: totalDiscount,
        discount_type: "PER",
        discount_amount: totalDiscAmount,
        row_total: newRowTotal,
      };
    });
  };

  // Handle member change
  const handleMemberChange = async (selectedOption) => {
    if (selectedOption) {
      const selectedMember = member.find(
        (m) => m.phone === selectedOption.value
      );
      if (selectedMember) {
        // existing member
        setForm((prev) => ({
          ...prev,
          member_id: selectedMember.member_id,
          member_no: selectedMember.member_no,
          name: selectedMember.name,
          phone: selectedMember.phone,
          membership: selectedMember.membership || "",
        }));

        // Clear previous milestone discount
        dispatch(clearMilestoneDiscount());

        // Fetch milestone extra discount
        if (selectedMember.member_id) {
          const extraRate = await dispatch(
            getMilestoneDiscount(selectedMember.member_id)
          ).unwrap();
          console.log("Extra discount rate:", extraRate);

          // Apply discounts to all existing rows
          setRows((prevRows) =>
            applyDiscountsToRows(prevRows, selectedMember.membership, extraRate)
          );

          if (extraRate > 0) {
            NotifyData(
              `Milestone discount applied: ${extraRate}% extra (Total: ${
                selectedMember.membership === "Yes" ? 28 : 10
              }%)`,
              "info"
            );
          } else {
            NotifyData("Member found and details loaded!", "success");
          }
        } else {
          NotifyData("Member found and details loaded!", "success");
        }
      }
    } else {
      // cleared
      setForm((prev) => ({
        ...prev,
        member_id: "",
        member_no: "",
        name: "",
        phone: "",
        membership: "",
      }));
      dispatch(clearMilestoneDiscount());
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

  // New: Handle Payment Method Change
  const handlePaymentMethodChange = (selected) => {
    setPaymentMethod(selected ? selected.value : "Cash");
  };

  // New: Handle Payment Amount Change
  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(parseFloat(e.target.value) || 0);
  };

  // New: Add Payment
  const addPayment = () => {
    if (paymentAmount <= 0) {
      NotifyData("Enter a valid amount!", "error");
      return;
    }
    const newPayment = { method: paymentMethod, amount: paymentAmount };
    setPayments((prev) => [...prev, newPayment]);
    setPaymentAmount(0); // Reset input
    NotifyData(`${paymentMethod}: ₹${paymentAmount} added!`, "success");
  };

  // New: Remove Payment
  const removePayment = (index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  // New Member Form Handlers
  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMemberForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewMemberSubmit = async () => {
    if (newMemberSubmitting) return;
    setNewMemberSubmitting(true);

    if (!newMemberForm.name.trim() || !newMemberForm.phone.trim()) {
      NotifyData("Name and Phone required!", "error");
      setNewMemberSubmitting(false);
      return;
    }
    if (!/^\d{10}$/.test(newMemberForm.phone)) {
      NotifyData("Phone must be 10 digits!", "error");
      setNewMemberSubmitting(false);
      return;
    }

    try {
      const payload = {
        action: "addmember",
        name: newMemberForm.name,
        phone: newMemberForm.phone,
        membership: newMemberForm.membership,
      };
      const msg = await dispatch(addMember(payload)).unwrap();
      NotifyData(msg, "success");

      // Refresh members list
      await dispatch(fetchMembers(""));

      // Find the newly added member by phone and auto-populate
      const newMember = member.find((m) => m.phone === newMemberForm.phone);
      if (newMember) {
        setForm((prev) => ({
          ...prev,
          member_id: newMember.member_id,
          member_no: newMember.member_no,
          name: newMemberForm.name,
          phone: newMemberForm.phone,
          membership: newMemberForm.membership,
        }));
      }

      // Close modal
      setShowNewMemberModal(false);
      setNewMemberForm({ name: "", phone: "", membership: "No" });

      NotifyData("New member added and loaded!", "success");
    } catch (e) {
      NotifyData(e.message, "error");
    } finally {
      setNewMemberSubmitting(false);
    }
  };

  // Handle row changes
  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const newRows = [...prev];
      const row = { ...newRows[index] };

      if (field === "category_id") {
        row.category_id = value;
        // Always clear product when category changes
        row.product_id = "";
        row.product_name = "";
        row.product_price = 0;
        row.qty = 1;
        row.row_total = 0;
        row.discount_amount = 0;
      } else if (field === "product_id") {
        const selectedProduct = products.find(
          (p) => p.productandservice_id === value
        );
        row.product_id = value;
        row.product_name = selectedProduct?.productandservice_name || "";
        row.product_price = selectedProduct?.productandservice_price || 0;
        row.category_id = selectedProduct?.category_id || "";
      } else if (field === "staff_id") {
        // Single staff handling
        row.staff_id = value ? value.value : null;
        row.staff_name = value ? value.label : "";
      } else if (field === "qty") {
        row.qty = parseFloat(value) || 0;
      } else if (field === "discount") {
        row.discount = parseFloat(value) || 0;
      } else if (field === "discount_type") {
        row.discount_type = value;
      }

      // Recalculate row total and discount_amount (manual discount overrides auto)
      const rowSubtotal = (row.qty || 0) * (row.product_price || 0);
      let discAmount = row.discount || 0;
      if (row.discount_type === "PER") {
        discAmount = (row.discount / 100) * rowSubtotal;
      }
      row.row_total = rowSubtotal - discAmount;
      row.discount_amount = discAmount;

      newRows[index] = row;
      return newRows;
    });
  };

  // Add row
  const addRow = () => {
    // If any existing row has no staff
    const missingStaff = rows.some((r) => !r.staff_id);

    if (missingStaff) {
      NotifyData("Please select staff before adding a new row!", "error");
      return; // stop adding row
    }

    const newRow = {
      category_id: "",
      product_id: "",
      product_name: "",
      product_price: 0,
      qty: 1,
      discount: 0,
      discount_type: "PER",
      discount_amount: 0,
      // Single staff
      staff_id: null,
      staff_name: "",
      row_total: 0,
    };

    // Apply auto discounts for new row
    if (form.member_id && form.membership) {
      const totalDiscount =
        form.membership === "Yes" ? 18 + extraDiscountRate : extraDiscountRate;
      newRow.discount = totalDiscount;
      newRow.discount_amount = (totalDiscount / 100) * (1 * 0); // 0 initially
    }

    setRows((prev) => [...prev, newRow]);
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
      const balance = grand_total - paid;
      let billingPayload = {
        ...form,
        member_id: form.member_id,
        productandservice_details: JSON.stringify(
          rows.map((r) => ({
            category_id: r.category_id,
            productandservice_id: r.product_id,
            productandservice_name: r.product_name,
            productandservice_price: r.product_price,
            qty: r.qty,
            discount: r.discount,
            discount_type: r.discount_type,
            discount_amount: r.discount_amount,
            // Add staff_name
            staff_id: r.staff_id,
            staff_name: r.staff_name,
            total: r.row_total,
          }))
        ),
        subtotal,
        discount: overall_discount,
        discount_type,
        total: grand_total,
        paid,
        balance,
        payment_details: JSON.stringify(payments),
      };

      if (isEdit) {
        billingPayload.billing_id = id;
        const msg = await dispatch(updateBilling(billingPayload)).unwrap();
        NotifyData(msg, "success");
      } else {
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

  const balance = grand_total - paid;

  // Custom filter for product select
  const productFilterOption = (option, rawInput) => {
    if (!rawInput) return true;
    const inputValue = rawInput.trim().toLowerCase();
    const label = option.label;
    // If input is numeric, exact match serial
    const isNumeric = /^\d+$/.test(inputValue);
    if (isNumeric) {
      const serialMatch = label.match(/^(\d+)/);
      const serial = serialMatch ? serialMatch[1] : "";
      return serial === inputValue;
    } else {
      // Search in entire label
      return label.toLowerCase().includes(inputValue);
    }
  };

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
            <div className="d-flex gap-2">
              <Select
                options={phoneOptions}
                isSearchable={true}
                placeholder="phone"
                value={phoneValue}
                onChange={handleMemberChange}
                className="flex-grow-1"
              />
              {!isEdit && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowNewMemberModal(true)}
                >
                  +
                </Button>
              )}
            </div>
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
                  <th>Category</th>
                  <th>Product/Service</th>
                  <th>Qty</th>
                  <th>Discount</th>
                  <th>Service Provider</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const filteredProducts = row.category_id
                    ? products.filter((p) => p.category_id === row.category_id)
                    : products;
                  const filteredProductOptions = filteredProducts.map((p) => ({
                    value: p.productandservice_id,
                    label: p.serial_number
                      ? `${p.serial_number} - ${p.productandservice_name} `
                      : p.productandservice_name,
                  }));
                  const productValue = row.product_id
                    ? filteredProductOptions.find(
                        (opt) => opt.value === row.product_id
                      ) || {
                        value: row.product_id,
                        label: row.product_name,
                      }
                    : null;
                  return (
                    <tr key={index}>
                      <td>
                        <DropDown
                          placeholder="Select"
                          value={row.category_id}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "category_id",
                              e.target.value
                            )
                          }
                          options={categoryOptions}
                        />
                      </td>
                      <td>
                        <Select
                          options={filteredProductOptions}
                          value={productValue}
                          onChange={(selected) =>
                            handleRowChange(
                              index,
                              "product_id",
                              selected ? selected.value : ""
                            )
                          }
                          placeholder="Select Product/Service"
                          isSearchable={true}
                          filterOption={productFilterOption}
                          className="flex-grow-1"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minWidth: "250px",
                            }),
                          }}
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
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td>
                        {/* MODIFIED: Added gap-2 for spacing between dropdown and input */}
                        <div className="d-flex gap-2">
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
                            style={{ width: "50px" }}
                          />
                          <TextInputform
                            formtype="text"
                            step="0.01"
                            PlaceHolder="Amount"
                            value={row.discount}
                            onChange={(e) =>
                              handleRowChange(index, "discount", e.target.value)
                            }
                            style={{ width: "70px" }}
                          />
                        </div>
                      </td>
                      <td>
                        {/* Single Select */}
                        <Select
                          options={staffOptions}
                          value={
                            staffOptions.find(
                              (opt) => opt.value === row.staff_id
                            ) || null
                          }
                          onChange={(selected) =>
                            handleRowChange(index, "staff_id", selected)
                          }
                          placeholder="Select"
                        />
                      </td>
                      <td>₹{row.row_total.toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeRow(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Button variant="success" onClick={addRow}>
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
                  <strong>Discount</strong>
                  <div className="d-flex gap-2 align-items-center">
                    <DropDown
                      placeholder="Type"
                      value={discount_type}
                      onChange={handleDiscountTypeChange}
                      options={discountTypeOptions}
                      style={{ width: "80px" }}
                    />
                    <TextInputform
                      formtype="text"
                      step="0.01"
                      PlaceHolder="Amount"
                      value={overall_discount}
                      onChange={handleOverallDiscountChange}
                      style={{ width: "100px" }}
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center  pt-2">
                  <strong>Total</strong>
                  <span>₹{grand_total.toFixed(2)}</span>
                </div>
                {/* New: Payment Methods Section */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Payment Method</strong>
                    <div className="d-flex gap-2 align-items-center">
                      <Select
                        options={paymentOptions}
                        value={paymentOptions.find(
                          (opt) => opt.value === paymentMethod
                        )}
                        onChange={handlePaymentMethodChange}
                        placeholder="Select Method"
                        className="flex-grow-1"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minWidth: "150px",
                          }),
                        }}
                      />
                      <TextInputform
                        formtype="text"
                        step="0.01"
                        PlaceHolder="Amount"
                        value={paymentAmount}
                        onChange={handlePaymentAmountChange}
                        style={{ width: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="py-2">
                    <Button variant="success" size="sm" onClick={addPayment}>
                      Add
                    </Button>
                  </div>

                  {/* Payment List */}
                  {payments.length > 0 && (
                    <div className="border p-2 bg-light">
                      <strong>Payments:</strong>
                      <ul className="list-unstyled mb-0">
                        {payments.map((p, index) => (
                          <li
                            key={index}
                            className="d-flex justify-content-between align-items-center small"
                          >
                            <span>
                              {p.method}: ₹{p.amount.toFixed(2)}
                            </span>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-danger"
                              onClick={() => removePayment(index)}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <strong>Paid</strong>
                  <span>₹{paid.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center  pt-2">
                  <strong>{balance >= 0 ? "Balance" : "Change"}</strong>
                  <span>₹{Math.abs(balance).toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Stats Container - Compact for 3 Fields */}
          {form.member_id && (
            <Col md={4}>
              <Card>
                <Card.Header>Member Status</Card.Header>
                <Card.Body className="p-2">
                  {(() => {
                    const selectedMember = member.find(
                      (m) => m.member_id === form.member_id
                    );
                    return selectedMember ? (
                      <>
                        <div className="mb-2 d-flex justify-content-between align-items-center">
                          <strong>Last Visit Date</strong>
                          <span>
                            {selectedMember.last_visit_date
                              ? formatDate(selectedMember.last_visit_date)
                              : "-"}
                          </span>
                        </div>
                        <div className="mb-2 d-flex justify-content-between align-items-center">
                          <strong>Total Visit Count</strong>
                          <span>{selectedMember.total_visit_count || 0}</span>
                        </div>
                        <div className="mb-2 d-flex justify-content-between align-items-center">
                          <strong>Total Spending</strong>
                          <span>₹{selectedMember.total_spending || 0}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>Membership</strong>
                          <span>{selectedMember.membership || "-"}</span>
                        </div>
                        {extraDiscountRate > 0 && (
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>Extra Discount</strong>
                            <span>{extraDiscountRate}%</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-muted">
                        No Member Data
                      </div>
                    );
                  })()}
                </Card.Body>
              </Card>
            </Col>
          )}
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

      {/* New Member Modal */}
      <Modal
        show={showNewMemberModal}
        onHide={() => setShowNewMemberModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name *</Form.Label>
              <TextInputform
                formtype="text"
                PlaceHolder="Enter name"
                name="name"
                value={newMemberForm.name}
                onChange={handleNewMemberChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone *</Form.Label>
              <TextInputform
                formtype="text"
                PlaceHolder="10 digits"
                name="phone"
                value={newMemberForm.phone}
                onChange={handleNewMemberChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Membership</Form.Label>
              <DropDown
                placeholder="Select"
                name="membership"
                value={newMemberForm.membership}
                onChange={handleNewMemberChange}
                options={newMemberMembershipOptions}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleNewMemberSubmit}
            disabled={newMemberSubmitting}
          >
            {newMemberSubmitting ? "Adding..." : "Add Member"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowNewMemberModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BillingCreation;
