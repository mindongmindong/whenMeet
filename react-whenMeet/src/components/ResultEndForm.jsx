import CalendarWeek from "./CalendarWeek";
import React, { useState } from "react";
import "../styles/ResultEnd.css";
import "../styles/CalendarWeek.css";
export default function ResultEndForm() {
  const [title, setTitle] = useState("Title 예시");
  const [resultTime, setresultTIme] = useState("00:37:30");
  const [completedPeopleNum, setcompletedPeopleNum] = useState(3);
  const [selectedDate, setSelectedDate] = useState("");
  //const [possibleDates, setpossibleDate] = useState("");
  const possibleDates = ["23.07.01 ~~~", "23.07.02 ~~~", "23.07.03 ~~~"];
  const [completedTasks, setCompletedTasks] = useState(3);
  const [totalTasks, setTotalTasks] = useState(7);
  const [timeLeft, setTimeLeft] = useState("00:37:30");
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div style={{ textAlign: "center", width: "50%" }}>
      <h1 className="title-box">{title}</h1>
      <p>투표가 종료되었습니다.</p>
      <p style={{ color: "blue" }}>약속 시간은 {resultTime}입니다.</p>
      <div>
        <h2>총 참여한 인원수</h2>
        <p>{completedPeopleNum}</p>
        <form className="form-container">
          {possibleDates.map((date, index) => (
            <label key={index}>
              <input
                type="radio"
                name="date"
                value={date}
                checked={selectedDate === date}
                onChange={handleDateChange}
              />
              {date}
            </label>
          ))}
        </form>
        <button
          style={{ marginTop: "20px", padding: "10px 20px" }}
          onClick={() => console.log(selectedDate)}
        >
          이 시간으로 정했어요
        </button>
        <button style={{ marginTop: "10px", padding: "10px 20px" }}>
          랜덤으로 약속 시간 확정하기
        </button>
      </div>
      <CalendarWeek className="calander" />
      <span
        className="possibleMan"
        style={{
          position: "absolute",
          marginTop: "100px",
          marginLeft: "100px",
        }}
      >
        <div style={{ textAlign: "center" }}>가능한 사람</div>
      </span>
    </div>
  );
}
