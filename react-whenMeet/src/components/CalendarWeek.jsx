import React, { useState } from "react";
import "../styles/CalendarWeek.css";
const hours = [...Array(24).keys()].map((i) => `${i}:00`); // 0:00 to 23:00
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CalendarWeek = () => {
  const [schedule, setSchedule] = useState({});

  const toggleHour = (day, hour) => {
    const daySchedule = schedule[day] || [];
    if (daySchedule.includes(hour)) {
      setSchedule({
        ...schedule,
        [day]: daySchedule.filter((h) => h !== hour),
      });
    } else {
      setSchedule({
        ...schedule,
        [day]: [...daySchedule, hour],
      });
    }
  };

  return (
    <table className="calendar-container">
      <thead>
        <tr>
          {["", ...days].map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour) => (
          <tr key={hour}>
            <td>{hour}</td>
            {days.map((day) => (
              <td
                key={day}
                className={schedule[day]?.includes(hour) ? "selected" : ""}
                onClick={() => toggleHour(day, hour)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CalendarWeek;
