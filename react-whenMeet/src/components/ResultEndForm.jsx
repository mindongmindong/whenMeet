import CalendarWeek from "./CalendarWeek";
import React, { useState } from "react";
import "../styles/ResultEnd.css";
import "../styles/CalendarWeek.css";
export default function ResultEndForm() {
  const meetingData = {
    id: "1ag123jkF1",
    title: "제목",
    purpose: "STUDY",
    startDate: "2023-12-20",
    endDate: "2024-1-07",
    currentParticipants: 2,
    maxParticipants: 4,
    voteExpiresAt: "2023-12-25T03:24:00",
    isClosed: false,
    participants: [
      {
        name: "test1",
        availableSchedules: [
          {
            availableDate: "2023-12-20",
            availableTimes: [6, 7, 8, 9, 14, 15, 16, 17],
          },
          {
            availableDate: "2023-12-21",
            availableTimes: [16, 17],
          },
          {
            availableDate: "2023-12-22",
            availableTimes: [24, 25, 26, 27, 28, 40, 41, 42],
          },
        ],
      },
      {
        name: "test2",
        availableSchedules: [
          {
            availableDate: "2023-12-22",
            availableTimes: [38, 40],
          },
        ],
      },
      {
        name: "test3",
        availableSchedules: [
          {
            availableDate: "2023-12-22",
            availableTimes: [38, 40, 41, 42],
          },
        ],
      },
      {
        name: "test4",
        availableSchedules: [
          {
            availableDate: "2023-12-22",
            availableTimes: [38],
          },
        ],
      },
      {
        name: "test5",
        availableSchedules: [
          {
            availableDate: "2023-12-22",
            availableTimes: [38],
          },
        ],
      },
      {
        name: "test6",
        availableSchedules: [
          {
            availableDate: "2023-12-22",
            availableTimes: [38],
          },
        ],
      },
    ],
  };
  const [title, setTitle] = useState(meetingData.title);
  const [resultTime, setresultTIme] = useState("00:37:30");
  const [completedPeopleNum, setcompletedPeopleNum] = useState(
    meetingData.currentParticipants
  );
  const [selectedDate, setSelectedDate] = useState("");
  const possibleDates = ["23.07.01 ~~~", "23.07.02 ~~~", "23.07.03 ~~~"];
  const [hoveredInfo, setHoveredInfo] = useState(null);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span className="row1">
        <h1 className="title-box">{title}</h1>
        <p>투표가 종료되었습니다.</p>
        <p style={{ color: "blue" }}>약속 시간은 {resultTime}입니다.</p>
        <div>
          <h2 style={{ flex: "none" }}>총 참여한 인원수</h2>
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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CalendarWeek
            participants={meetingData.participants}
            startDate={meetingData.startDate}
            endDate={meetingData.endDate}
            maxParticipants={meetingData.maxParticipants}
            hoveredInfo={hoveredInfo}
            setHoveredInfo={setHoveredInfo}
          />

          <div className="row2">
            <span className="possible">
              {hoveredInfo && (
                <div style={{ textAlign: "center" }}>
                  <strong>
                    {hoveredInfo.date} {hoveredInfo.time}에 가능한 사람:
                  </strong>
                  <ul>
                    {hoveredInfo.participants.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>
        </div>
      </span>
    </div>
  );
}
