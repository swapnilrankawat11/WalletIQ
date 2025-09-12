import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toTitleCase } from "../../utils/TextFormatter";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/common/TableActionButtons.css";

const TransactionList = ({
  transactions,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
}) => {

  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rows = transactions.map((row, index) => ({
    ...row,
    sno: index + 1,
    transaction_type_name_formatted:
      row.transaction_type?.name.charAt(0).toUpperCase() +
      row.transaction_type?.name.slice(1),
    account_name: row.account?.name,
    category_name_formatted: toTitleCase(row.category?.category_name),
    transaction_date_formatted: new Date(
      row.transaction_date
    ).toLocaleDateString(),
  }));

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns = [
    {
      field: "sno",
      headerName: "S. No",
      headerAlign: "center",
      align: "center",
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "transaction_type_name_formatted",
      headerName: "Transaction Type",
      headerAlign: "center",
      align: "center",
      width: 135,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      width: 150,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "account_name",
      headerName: "Account",
      headerAlign: "center",
      align: "center",
      width: 230,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "category_name_formatted",
      headerName: "Category",
      headerAlign: "center",
      align: "center",
      width: 105,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "transaction_date_formatted",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      width: 95,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "note",
      headerName: "Note",
      headerAlign: "center",
      align: "center",
      width: 225,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "actions",
      headerName: "Operations",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const originalTransactionItem = transactions.find(
          (tx) => tx.id === params.row.id
        );
        return (
          <div>
            <button
              className="edit-button"
              onClick={() => onEdit(originalTransactionItem)}
            >
              Edit
            </button>
            <button
              className="view-details-button"
              onClick={() => onViewDetails(originalTransactionItem)}
            >
              Details
            </button>
            <button
              className="delete-button"
              onClick={() => {
                setSelectedTransactionId(originalTransactionItem.id);
                setShowConfirmDeleteDialog(true);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div
        style={{
          height: rows.length >= 7 ? 500 : "auto",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 75, 100]}
          disableRowSelectionOnClick
          disableColumnSelector
          hideFooterSelectedRowCount
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
              outline: "none !important",
            },

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f1f3f5",
            },
            "& .css-1gqmilo-MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
              borderRight: "1px solid #e0e0e0",
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-iconSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader.Mui-focusVisible": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
          }}
        />
      </div>
      <Dialog
        open={showConfirmDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Transaction"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will permanently delete the selected transaction.
            <br />
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onDelete(selectedTransactionId);
              } catch (error) {
                console.error("Delete failed:", error);
              } finally {
                setShowConfirmDeleteDialog(false);
                setIsDeleting(false);
              }
            }}
            autoFocus
            color="error"
            disabled={isDeleting}
            sx={{
              "&:hover": {
                cursor: isDeleting ? "not-allowed" : "pointer",
              },
            }}
          >
            {isDeleting ? (
              <CircularProgress size={18} style={{ color: "red" }} />
            ) : (
              "Yes"
            )}
          </Button>
          <Button onClick={() => setShowConfirmDeleteDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionList;
