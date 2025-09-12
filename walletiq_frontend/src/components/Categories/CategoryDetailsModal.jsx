import { CircularProgress, Box } from "@mui/material";
import { toTitleCase } from "../../utils/TextFormatter";
import "../../styles/common/DetailsModal.css";

const CategoryDetailsModal = ({ category, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {category ? (
          <>
            <h3>Category Details</h3>
            <ul>
              <li>
                <strong>ID : </strong>
                {category.id}
              </li>
              <li>
                <strong>Name : </strong>
                {toTitleCase(category.category_name)}
              </li>
              <li>
                <strong>Type : </strong>
                {toTitleCase(category.category_type.name)}
              </li>
              <li>
                <strong>Created At : </strong>
                {new Date(category.created_at).toLocaleString()}
              </li>
              <li>
                <strong>Modified At : </strong>
                {new Date(category.modified_at).toLocaleString()}
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

export default CategoryDetailsModal;
