import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import {
  fetchProductAndServices,
  addProductAndService,
  updateProductAndService,
} from "../../slice/ProductAndServiceSlice";

const ProductAndServiceCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { productandservice } = useSelector((s) => s.productandservice);
  const isEdit = !!id;

  const [form, setForm] = useState({
    productandservice_name: "",
    productandservice_price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // load list (for edit lookup)
  useEffect(() => {
    dispatch(fetchProductAndServices(""));
  }, [dispatch]);

  // pre-fill on edit
  useEffect(() => {
    if (isEdit && productandservice.length) {
      const rec = productandservice.find((p) => p.productandservice_id === id);
      if (rec) {
        setForm({
          productandservice_name: rec.productandservice_name,
          productandservice_price: rec.productandservice_price,
        });
      }
    }
  }, [id, productandservice, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (!form.productandservice_name || !form.productandservice_price) {
      NotifyData("Required fields missing", "error");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      ...(isEdit && { productandservice_id: id }),
    };

    try {
      const action = isEdit
        ? updateProductAndService(payload)
        : addProductAndService(payload);
      const msg = await dispatch(action).unwrap();
      NotifyData(msg, "success");
      navigate("/productandservice");
    } catch (e) {
      NotifyData(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="main">
      <Container fluid className="p-3">
        <Row>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Product & Service Name"
              PlaceHolder="Enter name"
              name="productandservice_name"
              value={form.productandservice_name}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Price"
              PlaceHolder="Enter price"
              name="productandservice_price"
              value={form.productandservice_price}
              type="number"
              step="0.01"
              min="0"
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-4">
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
            onClick={() => navigate("/productandservice")}
            disabled={submitting}
          />
        </div>
      </Container>
    </div>
  );
};

export default ProductAndServiceCreation;
