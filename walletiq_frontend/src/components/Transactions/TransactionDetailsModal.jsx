import { CircularProgress, Box } from "@mui/material";
import { toTitleCase } from "../../utils/TextFormatter";
import "../../styles/common/DetailsModal.css";

const TransactionDetailsModal = ({ transaction, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {transaction ? (
          <>
            <h3>Transaction Details</h3>
            <ul>
              <li>
                <strong>ID : </strong> {transaction.id}
              </li>
              <li>
                <strong>Type : </strong>
                {toTitleCase(transaction.transaction_type?.name)}
              </li>
              <li>
                <strong>Amount : </strong>₹ {transaction.amount}
              </li>
              <li>
                <strong>Category : </strong>
                {toTitleCase(transaction.category?.category_name)}
              </li>
              <li>
                <strong>Account : </strong>
                {transaction.account.name}
              </li>
              <li>
                <strong>Date : </strong>
                {new Date(transaction.transaction_date).toLocaleString()}
              </li>
              <li>
                <strong>Note : </strong>
                {transaction.note}
              </li>
              <li>
                <strong>Created At : </strong>
                {new Date(transaction.created_at).toLocaleString()}
              </li>
              <li>
                <strong>Modified At : </strong>
                {new Date(transaction.modified_at).toLocaleString()}
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

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
