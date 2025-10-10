import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../slice/CategorySlice";
import { TbCircleLetterI } from "react-icons/tb";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import CategoryCreation from "../creations/CategoryCreation";

const Category = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(
    (state) => state.categories
  );
  console.log({ categories, status, error });

  console.log(categories);
  const categorySchema = [
    {
      name: "category_name",
      label: "Category Name",
      type: "text",
      required: true,
    },
  ];

  const [formData, setFormData] = useState({
    category_name: "",
  });

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(formData);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    setEditMode(true);
    setSelectedCategory(category || {}); // Fallback to an empty object
    setFormData({
      category_name: category?.category_name || "", // Use optional chaining with a default value
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({});
    handleOpen();
  };

  const handleSubmit = async () => {
    console.log("EditMode:", editMode);
    console.log("Selected Category ID:", selectedCategory?.id || "N/A");
    console.log("Form Data being dispatched:", formData || {});

    if (editMode) {
      if (!selectedCategory?.id) {
        console.error("No category selected for editing.");
        NotifyData("Category Update Failed: No category selected", "error");
        return;
      }

      if (!formData?.category_name) {
        console.error("Incomplete form data:", formData);
        NotifyData("Category Update Failed: Incomplete data", "error");
        return;
      }
      console.log("updatedresponse", formData?.category_name);
      try {
        const result = await dispatch(
          updateCategory({
            id: selectedCategory?.id,
            category_name: formData.category_name,
          })
        ).unwrap();

        console.log("API Response:", result);
        NotifyData("Category Updated Successfully", "success");
      } catch (error) {
        console.error("Error updating category:", error);
        NotifyData("Category Update Failed", "error");
      }
    } else {
      if (!formData?.category_name) {
        console.error("Incomplete form data:", formData);
        NotifyData("Category Creation Failed: Incomplete data", "error");
        return;
      }

      try {
        await dispatch(addCategory(formData)).unwrap();
        NotifyData("Category Created Successfully", "success");
      } catch (error) {
        console.error("Error creating category:", error);
        NotifyData("Category Creation Failed", "error");
      }
    }

    handleClose();
    setFormData({ category_name: "" });
    setEditMode(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id)).unwrap();
    NotifyData("Category Deleted Successfully", "success");
  };

  const filteredCategories =
    categories?.filter((category) =>
      (category?.category_name || "")
        .toLowerCase()
        ?.includes(searchTerm.toLowerCase())
    ) || [];

  const RoleHead = ["No", "Category Name"];
  const RoleData =
    filteredCategories?.length > 0
      ? filteredCategories.map((category, index) => ({
          values: [
            index + 1,
            category.category_name,

            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <TbCircleLetterI />,
                  onClick: () => handleEdit(category),
                },
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(category.id),
                },
              ]}
              label={<HiOutlineDotsVertical />}
            />,
          ],
        }))
      : [];
  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="Category" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="add-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" lg="3" className="py-2">
            <input
              type="text"
              placeholder="Search by category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={RoleHead} body={RoleData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={editMode ? <>Edit Category</> : <>Create Category</>}
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <>
            <CategoryCreation
              formData={formData}
              setFormData={setFormData}
              schema={categorySchema}
            />
          </>
        }
        OnClick={handleSubmit}
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Category;
