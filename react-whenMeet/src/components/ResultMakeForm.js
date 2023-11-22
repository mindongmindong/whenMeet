//결과 확인 페이지
import React, { useState, useEffect } from "react";
import CalendarWeek from "./CalendarWeek";
import { useNavigate } from "react-router-dom";

import "../styles/ResultMake.css";
function ResultMakeForm() {
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
    ],
  };
  const [title, setTitle] = useState(meetingData.title);
  const [currentParticipants, setcurrentParticipands] = useState(
    meetingData.currentParticipants
  );
  const [maxParticipants, setmaxParticipants] = useState(
    meetingData.maxParticipants
  );
  const [timeLeft, setTimeLeft] = useState("");
  const navigate = useNavigate();
  const [hoveredInfo, setHoveredInfo] = useState(null);
  // 타이머를 시작하고 관리하는 로직
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const voteExpires = new Date(meetingData.voteExpiresAt);
      const difference = voteExpires - now;

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      const formattedTime = `${
        newTimeLeft.days ? newTimeLeft.days + "일 " : ""
      }${newTimeLeft.hours ? newTimeLeft.hours + "시간 " : ""}${
        newTimeLeft.minutes ? newTimeLeft.minutes + "분 " : ""
      }${newTimeLeft.seconds ? newTimeLeft.seconds + "초" : ""}`;
      setTimeLeft(formattedTime);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [meetingData.voteExpiresAt]);

  const handleEdit = () => {
    navigate("/meetinginfo/linkpage");
  };

  return (
    <>
      <div className="column-container">
        <h1 className="title-box">{title}</h1>
        <div>
          현재 완료한 인원수 {currentParticipants} / {maxParticipants}
        </div>
        <div>종료까지 남은 시간 {timeLeft}</div>
        <button onClick={handleEdit}>수정하기</button>
        <button
          onClick={() => {
            navigate("/resultend");
          }}
        >
          투표 종료하기
        </button>
      </div>
      <span className="flex-row">
        <div className="calander-container">
          <CalendarWeek
            participants={meetingData.participants}
            startDate={meetingData.startDate}
            endDate={meetingData.endDate}
            maxParticipants={meetingData.maxParticipants}
            hoveredInfo={hoveredInfo}
            setHoveredInfo={setHoveredInfo}
          />
        </div>

        <span className="mostTime">
          <div style={{ textAlign: "center" }}>
            가장 많은 사람들이 가능한 일정
          </div>
          <ol>//일정 5개 나열</ol>
        </span>
        <span className="possible">
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
        </span>
      </span>
    </>
  );
}
export default ResultMakeForm;
