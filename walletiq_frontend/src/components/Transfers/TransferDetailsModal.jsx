import { toTitleCase } from "../../utils/TextFormatter";
import { CircularProgress, Box } from "@mui/material";
import "../../styles/common/DetailsModal.css";

const TransactionDetailsModal = ({ transfer, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {transfer ? (
          <>
            <h3>Transfer Details</h3>
            <ul>
              <li>
                <strong>ID : </strong>
                {transfer.id}
              </li>
              <li>
                <strong>Type : </strong>
                {toTitleCase(transfer.transaction_type_name)}
              </li>
              <li>
                <strong>Amount : </strong>₹ {transfer.amount}
              </li>
              <li>
                <strong>From : </strong>
                {transfer.from_account_name}
              </li>
              <li>
                <strong>To : </strong>
                {transfer.to_account_name}
              </li>
              <li>
                <strong>Date : </strong>
                {new Date(transfer.transaction_date).toLocaleString()}
              </li>
              <li>
                <strong>Note : </strong>
                {transfer.note}
              </li>
              <li>
                <strong>Created At : </strong>
                {new Date(transfer.created_at).toLocaleString()}
              </li>
              <li>
                <strong>Modified At : </strong>
                {new Date(transfer.modified_at).toLocaleString()}
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
