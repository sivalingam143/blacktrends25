import { useState } from "react";

const FormHandle = (initialValues) => {
  const [formData, setformData] = useState(initialValues);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const resetForm = () => {
    setformData(initialValues);
  };

  return [formData, handleChange, resetForm, setformData];
};

export default FormHandle;
