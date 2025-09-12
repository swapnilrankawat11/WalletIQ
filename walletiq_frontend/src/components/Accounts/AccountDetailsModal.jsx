import { CircularProgress, Box } from "@mui/material";
import "../../styles/common/DetailsModal.css";
import { toTitleCase } from "../../utils/TextFormatter";
const AccountDetailsModal = ({ account, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {account ? (
          <>
            <h3>Account Details</h3>
            <ul>
              <li>
                <strong>ID : </strong>
                {account.id}
              </li>
              <li>
                <strong>Group : </strong>
                {toTitleCase(account.group.name)}
              </li>
              <li>
                <strong>Name : </strong>
                {account.name}
              </li>
              <li>
                <strong>Amount : </strong>₹ {account.amount}
              </li>
              <li>
                <strong>Note : </strong>
                {account.note}
              </li>
              <li>
                <strong>Created At : </strong>
                {new Date(account.created_at).toLocaleString()}
              </li>
              <li>
                <strong>Modified At : </strong>
                {new Date(account.modified_at).toLocaleString()}
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

export default AccountDetailsModal;
