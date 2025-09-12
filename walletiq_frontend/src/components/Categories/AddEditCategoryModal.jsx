import { useEffect, useState } from "react";
import { addCategory, updateCategory } from "../../services/categoriesApi";
import { getTransactionTypes } from "../../services/transactionTypesApi";
import { toast } from "react-toastify";
import { toTitleCase } from "../../utils/TextFormatter";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/categories/AddEditCategoryModal.css";
import "../../styles/common/AddEditModal.css";

const AddEditCategoryModal = ({
  editingCategoryDetails,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    category_name: "",
    category_type_id: "",
  });

  const [transactionTypes, setTransactionTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactionTypes = async () => {
    try {
      const response = await getTransactionTypes();
      setTransactionTypes(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchTransactionTypes();
  }, []);

  useEffect(() => {
    if (editingCategoryDetails) {
      setFormData({
        category_name: editingCategoryDetails.category_name,
        category_type_id: editingCategoryDetails.category_type.id,
      });
    }
  }, [editingCategoryDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) e.target.className = "";
  };

  const validateFormData = () => {
    const errs = {};

    const categoryNameRegex = /^[A-Za-z\s]+$/;

    if (!formData.category_name || !formData.category_name.trim()) {
      errs.category_name = "Category name is required.";
    } else if (formData.category_name.length > 50) {
      errs.category_name = "Category name must be less than 50 characters.";
    } else if (!isNaN(formData.category_name.trim())) {
      errs.category_name = "Category name can't be a number.";
    } else if (!categoryNameRegex.test(formData.category_name.trim())) {
      errs.category_name = "Category name can only contain letters and spaces.";
    }

    if (!formData.category_type_id) {
      errs.category_type_id = "Category Type is required.";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    const validationErrors = validateFormData();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      category_name: formData.category_name,
      category_type_id: Number(formData.category_type_id),
    };

    try {
      setIsSubmitting(true);
      if (editingCategoryDetails) {
        await updateCategory(editingCategoryDetails.id, payload);
        setAlertMessage("Updated Successfully.");
      } else {
        await addCategory(payload);
        setAlertMessage("Added Successfully.");
        setFormData({ category_name: "", category_type_id: "" });
      }
      onSuccess();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="category-form">
          <h3>{editingCategoryDetails ? "Update" : "Add"} Category</h3>

          {Object.keys(errors).length > 0 && (
            <div className="form-errors">
              <button
                className="close-errors-btn"
                type="button"
                onClick={() => setErrors({})}
              >
                ×
              </button>
              {Object.values(errors).map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {alertMessage && (
            <div className="form-success-submit">
              {alertMessage}
              <button
                className="close-alert-btn"
                type="button"
                onClick={() => setAlertMessage("")}
              >
                ×
              </button>
            </div>
          )}

          <input
            autoFocus
            type="text"
            name="category_name"
            placeholder="Enter category name"
            value={formData.category_name}
            onChange={handleChange}
            className={errors.category_name ? "input-error" : ""}
          />
          <select
            name="category_type_id"
            value={formData.category_type_id}
            onChange={handleChange}
            className={errors.category_type_id ? "input-error" : ""}
          >
            <option value="">Select Category Type</option>
            {transactionTypes.map((txType) => (
              <option key={txType.id} value={txType.id}>
                {toTitleCase(txType.name)}
              </option>
            ))}
          </select>
          <div className="category-form-buttons">
            <button
              className="save-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={10} style={{ color: "white" }} />
              ) : (
                `${editingCategoryDetails ? "Save" : "Add"}`
              )}
            </button>

            <button className="close-button" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCategoryModal;
