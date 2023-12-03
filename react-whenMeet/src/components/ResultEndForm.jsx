import CalendarWeek from "./CalendarWeek";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/ResultEnd.css";
import "../styles/CalendarWeek.css";
export default function ResultEndForm() {
  const [meetingData, setMeetingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const possibleDates = ["23.07.01 ~~~", "23.07.02 ~~~", "23.07.03 ~~~"];
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const { meeting_id } = useParams();
  const purposeText = {
    STUDY: "스터디",
    MEETING: "회의",
    PLAYING: "놀기",
    FOOD: "식사",
    ETC: "기타",
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const response = await fetch(`/meetings/${meeting_id}/details`);
        if (!response.ok) {
          throw new Error("API 호출 오류");
        }
        const data = await response.json();
        setMeetingData(data);

        setSelectedDate(
          data.participants[0].availableSchedules[0].availableDate
        );
      } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
      }
    };

    if (meeting_id) {
      fetchMeetingData();
    }
  }, [meeting_id]);

  if (!meetingData) {
    return <div>로딩 중...</div>;
  }

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
            {meetingData.purpose && purposeText[meetingData.purpose]}를 하는
            다른 사람들은 주로 평일 낮 시간대에 많이 만나요
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
          currentParticipants={meetingData.currentParticipants}
          maxParticipants={meetingData.maxParticipants}
          hoveredInfo={hoveredInfo}
          setHoveredInfo={setHoveredInfo}
          availableVotingStartTime={meetingData.availableVotingStartTime}
          availableVotingEndTime={meetingData.availableVotingEndTime}
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
