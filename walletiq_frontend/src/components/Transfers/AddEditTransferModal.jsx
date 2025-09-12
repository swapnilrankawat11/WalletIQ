import { useEffect, useState } from "react";
import { addTransfer, updateTransfer } from "../../services/transfersApi";
import { getAccounts } from "../../services/accountsApi";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "../../styles/common/AddEditModal.css";
import "../../styles/transfers/AddEditTransferModal.css";
dayjs.extend(utc);
dayjs.extend(timezone);

const AddEditTransferModal = ({
  editingTransferDetails,
  onSuccess,
  onCancel,
  fromAccount,
  disableFromAccountField,
  calendarTxDate,
  disableDateField,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    transaction_date: calendarTxDate
      ? dayjs(calendarTxDate).format("YYYY-MM-DDTHH:mm")
      : dayjs().format("YYYY-MM-DDTHH:mm"),
    from_account: fromAccount || "",
    to_account: "",
    note: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts();
      setAccounts(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (editingTransferDetails) {
      setFormData({
        ...editingTransferDetails,
        transaction_date: dayjs
          .utc(editingTransferDetails.transaction_date)
          .local()
          .format("YYYY-MM-DDTHH:mm"),
      });
    }
  }, [editingTransferDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) e.target.className = "";
  };

  const validateFormData = () => {
    const errs = {};

    if (!formData.amount || !formData.amount.trim()) {
      errs.amount = "Amount is required.";
    }

    if (!fromAccount) {
      if (!formData.from_account) {
        errs.from_account = "Choose account from which you transfer fund.";
      }
    }

    if (!formData.to_account) {
      errs.to_account = "Choose account to which you transfer fund.";
    } else if (formData.from_account == formData.to_account) {
      errs.to_account = "Choose a different account to transfer fund.";
    }

    if (!formData.transaction_date) {
      errs.transaction_date = "Date is required.";
    }

    if (formData.note && formData.note.trim().length > 255) {
      errs.note = "Note must be less than 255 characters";
    }

    return errs;
  };

  const filteredToAccounts = fromAccount
    ? accounts.filter((acc) => acc.id !== fromAccount)
    : accounts;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    const validationErrors = validateFormData();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    const payload = {
      amount: Number(formData.amount),
      from_account: Number(formData.from_account),
      to_account: Number(formData.to_account),
      note: formData.note,
      transaction_date: dayjs(formData.transaction_date).utc().toISOString(),
    };

    try {
      setIsSubmitting(true);
      if (editingTransferDetails) {
        await updateTransfer(editingTransferDetails.id, payload);
        setAlertMessage("Updated Successfully.");
      } else {
        await addTransfer(payload);
        setAlertMessage("Added Successfully.");
        setFormData({
          transaction_type: "",
          from_account: "",
          amount: "",
          to_account: "",
          note: "",
          transaction_date: "",
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
        <form onSubmit={handleSubmit} className="transfer-form">
          <h3>{editingTransferDetails ? "Update" : "Add"} Transfer</h3>

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
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? "input-error" : ""}
          />

          <select
            name="from_account"
            value={formData.from_account}
            disabled={disableFromAccountField}
            onChange={handleChange}
            className={errors.from_account ? "input-error" : ""}
          >
            <option value="">Transfer From</option>
            {accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            name="to_account"
            value={formData.to_account}
            onChange={handleChange}
            className={errors.to_account ? "input-error" : ""}
          >
            <option value="">Transfer To</option>
            {filteredToAccounts.map((item) => (
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
                `${editingTransferDetails ? "Save" : "Add"}`
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

export default AddEditTransferModal;
