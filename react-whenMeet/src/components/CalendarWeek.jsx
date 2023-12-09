import React, { useState, useEffect } from "react";
import "../styles/CalendarWeek.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarWeek = ({
  participants,
  startDate,
  endDate,
  currentParticipants,
  maxParticipants,
  hoveredInfo,
  setHoveredInfo,
  availableVotingStartTime,
  availableVotingEndTime,
}) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [schedule, setSchedule] = useState({});

  const parseTime = (time) => {
    // 자정("00:00:00")을 확인하여 48을 반환
    if (time === "00:00:00") {
      return 48;
    }

    const [hours, minutes] = time.split(":").map(Number);
    return hours * 2 + (minutes >= 30 ? 1 : 0); // 30분 단위로 계산
  };

  const startTimeSlot = parseTime(availableVotingStartTime);
  const endTimeSlot = parseTime(availableVotingEndTime);

  const handlePrevWeek = () => {
    setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex(Math.min(weeks.length - 1, currentWeekIndex + 1));
  };

  useEffect(() => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());
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

  const calculateOpacity = (dateString, timeString, currentParticipants) => {
    const availableCount =
      schedule[dateString]?.filter((s) => s.time === timeString).length || 0;

    // currentParticipants가 0이거나 null일 경우를 대비해 기본값 1 설정
    const participantsCount = currentParticipants || 1;

    return 100 - (availableCount / participantsCount) * 100;
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
  console.log(endTimeSlot, startTimeSlot);
  return (
    <div className="calendarWeekContainer wrap">
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
          {[...Array(endTimeSlot - startTimeSlot + 1).keys()].map((i) => {
            const timeSlot = startTimeSlot + i;
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
                  const opacity = calculateOpacity(
                    dateString,
                    timeString,
                    currentParticipants
                  );
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
    </div>
  );
};

export default CalendarWeek;
