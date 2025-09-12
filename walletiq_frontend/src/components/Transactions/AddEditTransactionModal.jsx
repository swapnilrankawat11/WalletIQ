import { useEffect, useState } from "react";
import {
  addTransaction,
  updateTransaction,
} from "../../services/transactionsApi";
import { getCategories } from "../../services/categoriesApi";
import { getTransactionTypes } from "../../services/transactionTypesApi";
import { getAccounts } from "../../services/accountsApi";
import { toast } from "react-toastify";
import { toTitleCase } from "../../utils/TextFormatter";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/common/AddEditModal.css";
import "../../styles/transactions/AddEditTransactionModal.css";
dayjs.extend(utc);
dayjs.extend(timezone);

const AddEditTransactionModal = ({
  onSuccess,
  editingTransactionDetails,
  onCancel,
  currentAccountId,
  disableAccountField,
  calendarTxDate,
  disableDateField,
}) => {
  const [formData, setFormData] = useState({
    transaction_type: "",
    category: "",
    amount: "",
    account_id: currentAccountId || "",
    note: "",
    transaction_date: calendarTxDate
      ? dayjs(calendarTxDate).format("YYYY-MM-DDTHH:mm")
      : dayjs().format("YYYY-MM-DDTHH:mm"),
  });

  const [categories, setCategories] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchModalFields = async () => {
      try {
        const catRes = await getCategories();
        const txTypeRes = await getTransactionTypes();
        const accRes = await getAccounts();

        if (isMounted) {
          setCategories(catRes.data);
          setTransactionTypes(txTypeRes.data);
          setAccounts(accRes.data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMsg =
            err?.response?.data?.error || "Something went wrong! Try Again.";
          toast.error(errorMsg);
        }
      }
    };

    fetchModalFields();

    return () => {
      isMounted = false; // executes on unmount
    };
  }, []);

  useEffect(() => {
    if (editingTransactionDetails) {
      setFormData({
        ...editingTransactionDetails,
        account_id: editingTransactionDetails.account.id,
        transaction_type: editingTransactionDetails.transaction_type.id,
        category: editingTransactionDetails.category.id,
        transaction_date: dayjs
          .utc(editingTransactionDetails.transaction_date)
          .local()
          .format("YYYY-MM-DDTHH:mm"),
      });
    }
  }, [editingTransactionDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) e.target.className = "";
  };

  const validateFormData = () => {
    const errs = {};

    if (!formData.transaction_type) {
      errs.transaction_type = "Transaction Type is required.";
    }

    if (!formData.category) {
      errs.category = "Category is required.";
    }

    if (!formData.amount || !formData.amount.trim()) {
      errs.amount = "Amount is required.";
    }

    if (!currentAccountId) {
      if (!formData.account_id) {
        errs.account_id = "Account is required.";
      }
    }

    if (!formData.transaction_date) {
      errs.transaction_date = "Date is required.";
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
      transaction_type_id: Number(formData.transaction_type),
      category_id: Number(formData.category),
      amount: Number(formData.amount),
      account_id: Number(formData.account_id),
      note: formData.note,
      transaction_date: dayjs(formData.transaction_date).utc().toISOString(),
    };

    try {
      setIsSubmitting(true);
      if (editingTransactionDetails) {
        await updateTransaction(editingTransactionDetails.id, payload);
        setAlertMessage("Updated Successfully");
      } else {
        await addTransaction(payload);
        setAlertMessage("Added Successfully");
        setFormData({
          transaction_type: "",
          category: "",
          amount: "",
          account_id: "",
          note: "",
        });
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
        <form onSubmit={handleSubmit} className="transaction-form">
          <h3>{editingTransactionDetails ? "Update" : "Add"} Transaction</h3>

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
            autoFocus
            name="transaction_type"
            value={formData.transaction_type}
            onChange={handleChange}
            className={errors.transaction_type ? "input-error" : ""}
          >
            <option value="">Select Transaction Type</option>
            {transactionTypes.map((txType) =>
              txType.name === "income" || txType.name === "expense" ? (
                <option key={txType.id} value={txType.id}>
                  {toTitleCase(txType.name)}
                </option>
              ) : null
            )}
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "input-error" : ""}
          >
            <option value="">Select Category</option>
            {categories
              .filter(
                (cat) =>
                  cat.category_type.id === Number(formData.transaction_type)
              )
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {toTitleCase(cat.category_name)}
                </option>
              ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? "input-error" : ""}
          />

          <select
            name="account_id"
            value={formData.account_id}
            disabled={disableAccountField}
            onChange={handleChange}
            className={errors.account_id ? "input-error" : ""}
          >
            <option value="">Select Account</option>
            {accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="note"
            placeholder="Enter a note/description"
            value={formData.note}
            onChange={handleChange}
            className={errors.note ? "input-error" : ""}
          />

          <input
            type="datetime-local"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            className={errors.transaction_date ? "input-error" : ""}
            disabled={disableDateField && disableDateField}
          />

          <div className="transaction-form-buttons">
            <button
              className="save-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={10} style={{ color: "white" }} />
              ) : (
                `${editingTransactionDetails ? "Save" : "Add"}`
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

export default AddEditTransactionModal;
