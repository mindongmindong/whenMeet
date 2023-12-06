import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CalendarWeek from "./CalendarWeek";
import PasswordModal from "./PasswordModal.jsx";
import "../styles/ResultEnd.css";
import "../styles/CalendarWeek.css";

function formatDateTime(dateTime) {
  console.log("원본 시간 데이터:", dateTime); // 원본 데이터 로그

  const parts = dateTime.split("-");
  const datePart = parts.slice(0, 3).join("-");
  const timePart = parseInt(parts[3], 10);
  const hours = Math.floor(timePart / 2);
  const minutes = (timePart % 2) * 30;

  // UTC 시간으로 변환
  const utcDate = new Date(
    `${datePart}T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00Z`
  );

  const year = utcDate.getUTCFullYear();
  const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = utcDate.getUTCDate().toString().padStart(2, "0");
  const utcHours = utcDate.getUTCHours().toString().padStart(2, "0");
  const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, "0");

  const formattedDateTime = `${year}년 ${month}월 ${day}일 ${utcHours}시 ${utcMinutes}분`;

  return formattedDateTime;
}

function formatConfirmedTime(isoString) {
  const utcDate = new Date(isoString);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간을 더함

  const year = kstDate.getFullYear();
  const month = (kstDate.getMonth() + 1).toString().padStart(2, "0");
  const day = kstDate.getDate().toString().padStart(2, "0");
  const hours = kstDate.getHours().toString().padStart(2, "0");
  const minutes = kstDate.getMinutes().toString().padStart(2, "0");

  return (
    `${year}년 ${month}월 ${day}일 ${hours}시` +
    (minutes !== "00" ? ` ${minutes}분` : "")
  );
}

function convertToISOFormat(dateTimeString) {
  const parts = dateTimeString.split("-");
  const datePart = parts.slice(0, 3).join("-");
  const timePart = parts[3];
  const hours = Math.floor(parseInt(timePart, 10) / 2);
  const minutes = (parseInt(timePart, 10) % 2) * 30;

  // 지역 시간을 생성 (KST)
  const localDate = new Date(`${datePart} ${hours}:${minutes}:00`);
  // UTC 시간으로 변환
  const utcDate = new Date(localDate.getTime() - 9 * 60 * 60 * 1000);

  return utcDate.toISOString();
}

export default function ResultEndForm() {
  const [meetingData, setMeetingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [possibleDates, setPossibleDates] = useState([]);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const { meeting_id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const purposeText = {
    STUDY: "스터디",
    MEETING: "회의",
    PLAYING: "놀기",
    FOOD: "식사",
    ETC: "기타",
  };
  const fetchMeetingData = async () => {
    try {
      const response = await fetch(`/meetings/${meeting_id}/details`);
      const data = await response.json();
      setMeetingData(data);

      // 가능한 시간 집계
      let availabilityMap = {};
      data.participants.forEach((participant) => {
        participant.availableSchedules.forEach((schedule) => {
          schedule.availableTimes.forEach((time) => {
            const dateTimeKey = schedule.availableDate + "-" + time;
            if (!availabilityMap[dateTimeKey]) {
              availabilityMap[dateTimeKey] = 0;
            }
            availabilityMap[dateTimeKey]++;
          });
        });
      });

      // 가장 많이 겹치는 시간 찾기
      const sortedAvailability = Object.entries(availabilityMap).sort(
        (a, b) => b[1] - a[1]
      );

      // 겹치는 시간이 가장 많은 상위 항목만 뽑기
      const mostAvailableTimes = sortedAvailability
        .filter((item, index, arr) => item[1] === arr[0][1])
        .map((item) => item[0]);

      setPossibleDates(mostAvailableTimes);
    } catch (error) {
      console.error("API 호출 중 에러 발생:", error);
    }
  };
  useEffect(() => {
    fetchMeetingData();
  }, [meeting_id]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const confirmSelectedTime = () => {
    if (!selectedDate) {
      alert("시간을 선택해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleRandomConfirm = () => {
    if (possibleDates.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleDates.length);
      const randomDateTime = possibleDates[randomIndex];
      setSelectedDate(randomDateTime);
      setIsModalOpen(true);
    } else {
      alert("선택 가능한 날짜와 시간이 없습니다.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePasswordSubmit = async (password) => {
    setIsModalOpen(false);
    try {
      const confirmedTimeISO = convertToISOFormat(selectedDate);
      const response = await axios.patch(
        `http://localhost:3000/meetings/${meeting_id}/confirm-time`,
        {
          adminPassword: password,
          confirmedTime: confirmedTimeISO,
        }
      );

      if (response.data && response.data.confirmedTime) {
        await fetchMeetingData();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("비밀번호가 틀렸습니다.");
      } else {
        console.error("오류 발생:", error);
      }
    }
  };
  if (!meetingData) {
    return <div>로딩 중...</div>;
  }
  console.log(meetingData.confirmedTime);
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span className="column-container">
        <h1 className="title-box">{meetingData.title}</h1>
        <p>투표가 종료되었습니다.</p>

        {meetingData.confirmedTime && (
          <div>
            <p style={{ color: "blue" }}>
              약속 시간은 {formatConfirmedTime(meetingData.confirmedTime)}
              입니다.
            </p>
            <div>
              <h2 style={{ justifyContent: "center" }}>총 참여한 인원수</h2>
              <h3>{meetingData.currentParticipants}</h3>
            </div>
          </div>
        )}
        {!meetingData.confirmedTime && (
          <span className="closedFalse">
            <p>
              {meetingData.purpose && purposeText[meetingData.purpose]}를 하는
              다른 사람들은 주로 평일 낮 시간대에 많이 만나요
            </p>

            <form className="form-container">
              {possibleDates.length > 0 ? (
                possibleDates.map((dateTime, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name="date"
                      value={dateTime}
                      checked={selectedDate === dateTime}
                      onChange={handleDateChange}
                    />
                    {formatDateTime(dateTime)}
                  </label>
                ))
              ) : (
                <h2>겹치는 시간대가 없습니다.</h2>
              )}
            </form>

            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                width: "300px",
              }}
              onClick={confirmSelectedTime}
            >
              이 시간으로 정했어요
            </button>
            <button
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                width: "300px",
              }}
              onClick={handleRandomConfirm}
            >
              랜덤으로 약속 시간 확정하기
            </button>
          </span>
        )}
      </span>
      <PasswordModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onSubmit={handlePasswordSubmit}
      />
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
