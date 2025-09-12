import { CircularProgress, Box } from "@mui/material";
import { toTitleCase } from "../../utils/TextFormatter";
import "../../styles/common/DetailsModal.css";

const BudgetDetailsModal = ({ budget, onClose }) => {

  return (
    <div className="modal-overlay">
      <div className="modal">
        {budget ? (
          <>
            <h3>Budget Details</h3>
            <ul>
              <li>
                <strong>ID : </strong>
                {budget.id}
              </li>
              <li>
                <strong>Category Name : </strong>
                {toTitleCase(budget.category_name)}
              </li>
              <li>
                <strong>Budget Amount : </strong>₹ {budget.amount}
              </li>
              <li>
                <strong>Total Amount Spent : </strong>₹ {budget.spent}
              </li>
              <li>
                <strong>Total Remaining Amount : </strong>₹ {budget.remaining}
              </li>
              <li>
                <strong>Overspent Amount : </strong>₹ {budget.overspent}
              </li>
              <li>
                <strong>Note : </strong>
                {budget.note}
              </li>
              <li>
                <strong>Created At : </strong>
                {new Date(budget.created_at).toLocaleString()}
              </li>
              <li>
                <strong>Modified At : </strong>
                {new Date(budget.modified_at).toLocaleString()}
              </li>
            </ul>
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress />
          </Box>
        )}

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BudgetDetailsModal;
