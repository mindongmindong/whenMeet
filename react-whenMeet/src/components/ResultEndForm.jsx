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

  const [selectedDate, setSelectedDate] = useState("2023-12-22"); // 임의의 예시 값
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
      <h1 className="title-box">{meetingData.title}</h1>
      <p>투표가 종료되었습니다.</p>

      {meetingData.isClosed ? (
        <div>
          <p style={{ color: "blue" }}>약속 시간은 {selectedDate}입니다.</p>
          <div>
            <h2 style={{ justifyContent: "center" }}>총 참여한 인원수</h2>
            <h3>{meetingData.currentParticipants}</h3>
          </div>
        </div>
      ) : (
        <span className="closedFalse">
          <p>
            {meetingData.purpose}를 하는 다른 사람들은 주로 평일 낮 시간대에
            많이 만나요
          </p>
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
        </span>
      )}

      <div className="flex-row">
        <CalendarWeek
          participants={meetingData.participants}
          startDate={meetingData.startDate}
          endDate={meetingData.endDate}
          maxParticipants={meetingData.maxParticipants}
          hoveredInfo={hoveredInfo}
          setHoveredInfo={setHoveredInfo}
        />
      </div>
      <div className="possible">
        {!hoveredInfo && (
          <div>
            <strong>가능한 사람들이 표시됩니다.</strong>
            <p>마우스를 달력 위에 올려보세요!</p>
          </div>
        )}
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
      </div>
    </div>
  );
}
