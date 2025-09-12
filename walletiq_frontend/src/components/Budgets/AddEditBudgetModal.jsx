import { useEffect, useState } from "react";
import { addBudget, updateBudget } from "../../services/budgetsApi";
import { getCategories } from "../../services/categoriesApi";
import { toast } from "react-toastify";
import { toTitleCase } from "../../utils/TextFormatter";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/budgets/AddEditBudgetModal.css";
import "../../styles/common/AddEditModal.css";

const AddEditBudgetModal = ({
  editingBudgetDetails,
  onCancel,
  budgetMonthYear,
}) => {
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    month: dayjs(budgetMonthYear).month() + 1,
    year: dayjs(budgetMonthYear).year(),
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [categories, setCategories] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingBudgetDetails) {
      setFormData({
        ...editingBudgetDetails,
        category_id: editingBudgetDetails.category,
      });
    }
  }, [editingBudgetDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) e.target.className = "";
  };

  const validateFormData = () => {
    const errs = {};

    if (!formData.category_id) {
      errs.category_id = "Please choose budget category.";
    }

    if (!formData.amount || !formData.amount.trim()) {
      errs.amount = "Budget amount required.";
    }

    if (formData.note && formData.note.trim().length > 255) {
      errs.note = "Note must be less than 255 characters";
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
      category: Number(formData.category_id),
      amount: Number(formData.amount),
      month: Number(formData.month),
      year: Number(formData.year),
      note: formData.note,
    };

    const queryParams = {
      month: formData.month,
      year: formData.year,
    };

    try {
      setIsSubmitting(true);
      if (editingBudgetDetails) {
        await updateBudget(editingBudgetDetails.id, payload, queryParams);
        setAlertMessage("Updated Successfully");
      } else {
        await addBudget(payload, queryParams);
        setAlertMessage("Added Successfully");
        setFormData({
          category_id: "",
          amount: "",
          note: "",
        });
      }
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
        <form onSubmit={handleSubmit} className="budget-form">
          <h3>{editingBudgetDetails ? "Update" : "Add"} Budget</h3>

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

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={errors.category_id ? "input-error" : ""}
          >
            <option value="">Select Category</option>
            {categories &&
              categories
                .filter((cat) => cat.category_type.name === "expense")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {toTitleCase(cat.category_name)}
                  </option>
                ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Enter budget amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? "input-error" : ""}
          />

          <input
            type="text"
            name="month"
            value={dayjs(budgetMonthYear).format("MMMM")}
            disabled
            className={errors.month ? "input-error" : ""}
          />

          <input
            type="text"
            name="year"
            value={dayjs(budgetMonthYear).year()}
            disabled
            className={errors.year ? "input-error" : ""}
          />

          <input
            type="text"
            name="note"
            placeholder="Enter a note/description"
            value={formData.note}
            onChange={handleChange}
            className={errors.note ? "input-error" : ""}
          />

          <div className="budget-form-buttons">
            <button
              className="save-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={10} style={{ color: "white" }} />
              ) : (
                `${editingBudgetDetails ? "Save" : "Add"}`
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

export default AddEditBudgetModal;
