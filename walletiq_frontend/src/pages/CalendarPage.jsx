import { useEffect, useState } from "react";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { getCalendarDayBadges } from "../services/calendarDayBadgesApi";
import { toast } from "react-toastify";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import CalendarDayDetailsModal from "../components/Calendar/CalendarDayDetailsModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar/Calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [dayBadges, setDayBadges] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    const fetchDayBadges = async () => {
      try {
        const response = await getCalendarDayBadges({ month, year });
        setDayBadges(response.data);
      } catch (err) {
        const errorMsg =
          err?.response?.data?.error || "Something went wrong! Try Again.";
        toast.error(errorMsg);
      }
    };

    fetchDayBadges();
  }, [selectedDate]);

  const events = dayBadges.map((badge) => ({
    title: `${badge.net_balance}₹`,
    start: new Date(badge.date),
    end: new Date(badge.date),
    allDay: true,
    income: badge.total_income,
    expense: badge.total_expense,
    net: badge.net_balance,
  }));

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          defaultView="month"
          style={{ height: "100%" }}
          onSelectSlot={(slotInfo) => handleDayClick(slotInfo.start)}
          selectable
          onSelectEvent={(event) => handleDayClick(event.start)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
            },
          })}
          onNavigate={(date) => {
            setSelectedDate(date);
          }}
          components={{
            event: ({ event }) => (
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderLeft: `2px solid ${
                    event.net >= 0 ? "#4CAF50" : "#F44336"
                  }`,
                  borderRadius: "4px",
                  padding: "4px 6px",
                  fontSize: "0.75rem",
                  margin: "10px 11px 0px 10px",
                  maxWidth: "100%",
                  overflow: "hidden",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: "#4CAF50", fontWeight: "500" }}>
                  + ₹{" "}
                  {Number(event.income).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div style={{ color: "#F44336", fontWeight: "500" }}>
                  – ₹{" "}
                  {Number(event.expense).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div style={{ color: "black", fontWeight: "500" }}>
                  ₹{" "}
                  {Number(event.net).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ),
          }}
        />
      </div>
      <CalendarDayDetailsModal
        date={selectedDate}
        handleClose={() => setShowModal(false)}
        isOpen={showModal}
      />
    </div>
  );
};

export default CalendarPage;
