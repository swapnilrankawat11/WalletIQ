import React from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import AccountInsightsAndAnalytics from "../Accounts/AccountInsightsAndAnalytics";
import "../../styles/calendar/CalendarDayDetailsModal.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AccountInsightsAndAnalyticsModal = ({
  handleClose,
  isOpen,
  accountId,
  accountName,
}) => {
  return (
    <Dialog
      fullScreen
      open={isOpen}
      slots={{
        transition: Transition,
      }}
    >
      <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
        <Toolbar>
          <Typography
            sx={{
              flex: 1,
              fontWeight: 600,
              fontSize: "1.25rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            variant="h6"
            component="div"
          >
            {accountName}
          </Typography>

          <IconButton
            edge="end"
            color="inherit"
            onClick={() => handleClose()}
            sx={{ ml: "auto" }}
          >
            <FaTimes />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        className="calendar-day-details-container"
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "0px 130px 20px 130px",
        }}
      >
        {accountId && <AccountInsightsAndAnalytics accountId={accountId} />}
      </Box>
    </Dialog>
  );
};

export default AccountInsightsAndAnalyticsModal;
