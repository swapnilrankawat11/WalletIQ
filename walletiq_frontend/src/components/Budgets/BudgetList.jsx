import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress, Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import { toTitleCase } from "../../utils/TextFormatter";
import "../../styles/common/TableActionButtons.css";

const BudgetList = ({ budgets, loading, onEdit, onViewDetails, onDelete }) => {
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rows = budgets.map((row, index) => ({
    ...row,
    sno: index + 1,
    category_name_formatted: toTitleCase(row.category_name),
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
      field: "category_name_formatted",
      headerName: "Category Name",
      headerAlign: "center",
      align: "center",
      width: 150,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "amount",
      headerName: "Budget",
      headerAlign: "center",
      align: "center",
      width: 180,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "spent",
      headerName: "Spent",
      headerAlign: "center",
      align: "center",
      width: 180,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "remaining",
      headerName: "Remaining",
      headerAlign: "center",
      align: "center",
      width: 180,
      sortable: true,
      disableColumnMenu: false,
    },
    {
      field: "progress",
      headerName: "Progress",
      headerAlign: "center",
      align: "center",
      width: 250,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const { amount, spent } = params.row;
        const ratio = amount === 0 ? 0 : spent / amount;
        const percentage = Math.min(ratio * 100, 100);
        const isOver = spent > amount;

        return (
          <Box width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              fontSize={12}
              mb={0.5}
            >
              <Typography variant="caption">₹{spent}</Typography>
              <Typography variant="caption">₹{amount}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: isOver ? "#e53935" : "#4caf50",
                },
              }}
            />
          </Box>
        );
      },
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
        const originalBudget = budgets.find((bd) => bd.id === params.row.id);
        return (
          <div>
            <button
              className="edit-button"
              onClick={() => onEdit(originalBudget)}
            >
              Edit
            </button>
            <button
              className="view-details-button"
              onClick={() => onViewDetails(originalBudget)}
            >
              Details
            </button>
            <button
              className="delete-button"
              onClick={() => {
                setSelectedBudgetId(originalBudget.id);
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
          pageSizeOptions={[10, 15, 25]}
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
        <DialogTitle id="alert-dialog-title">{"Delete Budget"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will permanently delete the selected budget.
            <br />
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onDelete(selectedBudgetId);
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

export default BudgetList;
