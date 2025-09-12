import React, { useState } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Box,
  Slide,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import CalendarDayTransaction from "./CalendarDayTransaction";
import CalendarDayTransfer from "./CalendarDayTransfer";
import "../../styles/calendar/CalendarDayDetailsModal.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CalendarDayDetailsModal = ({ date, isOpen, handleClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {date ? date.toDateString() : "No date selected"}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
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
          padding: "2px",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          aria-label="XYx"
        >
          <Tab label="Transactions" />
          <Tab label="Transfers" />
        </Tabs>

        {tabIndex === 0 && (
          <Box sx={{ px: 1, py: 2 }}>
            <CalendarDayTransaction date={date} />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ px: 1, py: 2 }}>
            <CalendarDayTransfer date={date} />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default CalendarDayDetailsModal;
