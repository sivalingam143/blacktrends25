import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import {
  fetchProductAndServices,
  deleteProductAndService,
} from "../../slice/ProductAndServiceSlice";

const ProductAndService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productandservice } = useSelector((s) => s.productandservice);

  useEffect(() => {
    dispatch(fetchProductAndServices(""));
  }, [dispatch]);

  const handleCreate = () => navigate("/productandservice/create");
  const handleEdit = (item) =>
    navigate(`/productandservice/edit/${item.productandservice_id}`);

  const handleDelete = async (id) => {
    try {
      const msg = await dispatch(deleteProductAndService(id)).unwrap();
      NotifyData(msg, "success");
      dispatch(fetchProductAndServices(""));
    } catch (e) {
      NotifyData(e.message, "error");
    }
  };

  // ---------- table ----------
  const headers = ["No", "Name", "Price"];
  const body = productandservice.map((item, idx) => ({
    key: item.productandservice_id,
    values: [
      idx + 1,
      item.productandservice_name,
      `₹ ${parseFloat(item.productandservice_price).toFixed(2)}`,
      <ActionButton
        options={[
          {
            label: "Edit",
            icon: <LiaEditSolid />,
            onClick: () => handleEdit(item),
          },
          {
            label: "Delete",
            icon: <MdOutlineDelete />,
            onClick: () => handleDelete(item.id),
          },
        ]}
        label={<HiOutlineDotsVertical />}
      />,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="Product & Service" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="add-btn"
              onClick={handleCreate}
            />
          </Col>

          <Col xs="12" className="py-3">
            <TableUI
              headers={headers}
              body={body}
              className="table"
              showActionColumn={true}
              noRecordMessage="No products/services found"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductAndService;
