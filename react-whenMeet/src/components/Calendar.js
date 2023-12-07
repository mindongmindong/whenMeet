import CalendarMonth from "./CalendarMonth";
import "../styles/Calendar.css";

function Calendar({ onChange, usingDate, setUsingDate }) {
  return <CalendarMonth usingDate={usingDate} setUsingDate={setUsingDate} />;
}

export default Calendar;
