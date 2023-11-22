import React, { useState, useEffect } from "react";
import "../styles/CalendarWeek.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarWeek = ({
  participants,
  startDate,
  endDate,
  maxParticipants,
  hoveredInfo,
  setHoveredInfo,
}) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [schedule, setSchedule] = useState({});

  const handlePrevWeek = () => {
    setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex(Math.min(weeks.length - 1, currentWeekIndex + 1));
  };

  useEffect(() => {
    const start = new Date(startDate);
    start.setDate(
      start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1)
    );
    const end = new Date(endDate);

    let weeksTemp = [];
    while (start <= end) {
      const weekStart = new Date(start);
      const weekDates = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        return date;
      });

      weeksTemp.push(weekDates);
      start.setDate(start.getDate() + 7);
    }
    setWeeks(weeksTemp);

    let newSchedule = {};
    participants.forEach((participant) => {
      participant.availableSchedules.forEach(
        ({ availableDate, availableTimes }) => {
          const date = new Date(availableDate);
          availableTimes.forEach((time) => {
            const hour = Math.floor(time / 2);
            const minute = (time % 2) * 30;
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;
            const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
            if (!newSchedule[dateString]) {
              newSchedule[dateString] = [];
            }
            newSchedule[dateString].push({
              time: timeString,
              name: participant.name,
            });
          });
        }
      );
    });
    setSchedule(newSchedule);
  }, [participants, startDate, endDate]);

  const calculateOpacity = (dateString, timeString) => {
    const availableCount =
      schedule[dateString]?.filter((s) => s.time === timeString).length || 0;
    return 100 - (availableCount / maxParticipants) * 100;
  };

  const handleMouseEnter = (dateString, timeString) => {
    const availableParticipants =
      schedule[dateString]
        ?.filter((s) => s.time === timeString)
        .map((s) => s.name) || [];
    setHoveredInfo({
      date: dateString,
      time: timeString,
      participants: availableParticipants,
    });
  };

  const handleMouseLeave = () => {
    setHoveredInfo(null);
  };

  const weekDates = weeks[currentWeekIndex] || [];

  return (
    <div className="wrap">
      <div className="button-container">
        <button onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
          Prev Week
        </button>
        <button
          onClick={handleNextWeek}
          disabled={currentWeekIndex === weeks.length - 1}
        >
          Next Week
        </button>
      </div>
      <table className="calendar-container">
        <thead>
          <tr>
            <th>Time</th>
            {weekDates.map((date) => (
              <th key={date.toISOString()}>
                {date.getMonth() + 1}/{date.getDate()} ({days[date.getDay()]})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(48).keys()].map((timeSlot) => {
            const hour = Math.floor(timeSlot / 2);
            const minute = (timeSlot % 2) * 30;
            return (
              <tr key={timeSlot}>
                <td>
                  {hour.toString().padStart(2, "0") +
                    ":" +
                    minute.toString().padStart(2, "0")}
                </td>
                {weekDates.map((date) => {
                  const dateString = `${date.getFullYear()}-${(
                    date.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`;
                  const timeString = `${hour
                    .toString()
                    .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                  const opacity = calculateOpacity(dateString, timeString);
                  const cellStyle = { opacity: `${opacity}%` };
                  return (
                    <td
                      key={`${date.toISOString()}-${timeString}`}
                      style={cellStyle}
                      onMouseEnter={() =>
                        handleMouseEnter(dateString, timeString)
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hoveredInfo && (
        <div className="possibleMan" style={{ textAlign: "center" }}>
          <strong>가능한 사람:</strong>
          <ul>
            {hoveredInfo.participants.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarWeek;
