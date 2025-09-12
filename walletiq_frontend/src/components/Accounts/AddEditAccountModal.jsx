import { useEffect, useState } from "react";
import { addAccount, updateAccount } from "../../services/accountsApi";
import { getAccountGroups } from "../../services/accountGroupsApi";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/accounts/AddEditAccountModal.css";
import "../../styles/common/AddEditModal.css";
import { toTitleCase } from "../../utils/TextFormatter";

const AddEditAccountModal = ({
  editingAccountDetails,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    group_id: "",
    name: "",
    amount: "",
    note: "",
  });

  const [accountGroups, setAccountGroups] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccountsGroups = async () => {
    try {
      const response = await getAccountGroups();
      setAccountGroups(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchAccountsGroups();
  }, []);

  useEffect(() => {
    if (editingAccountDetails) {
      setFormData({
        ...editingAccountDetails,
        group_id: editingAccountDetails.group.id,
      });
    }
  }, [editingAccountDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) e.target.className = "";
  };

  const validateFormData = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const nameTrimmed = formData?.name?.trim();
    const amountTrimmed = formData?.amount?.trim();
    const note = formData?.note;

    if (!formData.group_id) {
      errs.group_id = "Account Group is required.";
    }

    if (!nameTrimmed) {
      errs.name = "Account Name is required.";
    } else if (!isNaN(nameTrimmed)) {
      errs.name = "Account Name can't be a number.";
    } else if (!nameRegex.test(nameTrimmed)) {
      errs.name = "Account Name can only contain letters and spaces.";
    } else if (nameTrimmed.length > 50) {
      errs.name = "Account Name must be less than 50 characters.";
    }

    if (!amountTrimmed) {
      errs.amount = "Amount is required.";
    }

    if (note && note.trim().length > 255) {
      errs.note = "Note must be less than 255 characters.";
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
      group_id: Number(formData.group_id),
      name: formData.name,
      amount: Number(formData.amount),
      note: formData.note,
    };

    try {
      setIsSubmitting(true);
      if (editingAccountDetails) {
        await updateAccount(editingAccountDetails.id, payload);
        setAlertMessage("Updated Successfully.");
      } else {
        await addAccount(payload);
        setAlertMessage("Added Successfully.");
        setFormData({ group_id: "", name: "", amount: "", note: "" });
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
        <form onSubmit={handleSubmit} className="account-form">
          <h3>{editingAccountDetails ? "Update" : "Add"} Account</h3>

          {Object.keys(errors).length > 0 && (
            <div className="form-errors">
              <button
                className="close-errors-btn"
                type="button"
                onClick={() => setErrors({})}
              >
                ×
              </button>
              {Object.values(errors).map((err, index) => (
                <p key={index}>{err}</p>
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
            autoFocus
            name="group_id"
            value={formData.group_id}
            onChange={handleChange}
            className={errors.group_id ? "input-error" : ""}
          >
            <option value="">Select account group</option>
            {accountGroups.map((type) => (
              <option key={type.id} value={type.id}>
                {toTitleCase(type.name)}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter account name"
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? "input-error" : ""}
          />
          <input
            type="text"
            name="note"
            placeholder="Enter a note/description"
            value={formData.note}
            onChange={handleChange}
          />
          <div className="account-form-buttons">
            <button
              className="save-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={10} style={{ color: "white" }} />
              ) : (
                `${editingAccountDetails ? "Save" : "Add"}`
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

export default AddEditAccountModal;
