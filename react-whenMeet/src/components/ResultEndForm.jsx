import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CalendarWeek from "./CalendarWeek";
import PasswordModal from "./PasswordModal.jsx";
import "../styles/ResultEnd.css";
import "../styles/CalendarWeek.css";

function formatDateTime(date, timeIndex) {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  const hours = Math.floor(timeIndex / 2)
    .toString()
    .padStart(2, "0");
  const minutes = (timeIndex % 2) * 30;

  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes
    .toString()
    .padStart(2, "0")}분`;
}

function formatKSTDateTime(utcDateTime) {
  const date = new Date(utcDateTime);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (minutes === "00") {
    return `${year}년 ${month}월 ${day}일 ${hours}시`;
  } else {
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  }
}

export default function ResultEndForm() {
  const [meetingData, setMeetingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [possibleDates, setPossibleDates] = useState([]);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const { meeting_id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topThreeConfirmedTimes, setTopThreeConfirmedTimes] = useState([]);
  const purposeText = {
    STUDY: "스터디",
    MEETING: "회의",
    PLAYING: "놀기",
    FOOD: "식사",
    ETC: "기타",
  };
  console.log(possibleDates);
  const fetchMeetingData = async () => {
    try {
      const response = await fetch(`/meetings/${meeting_id}/details`);
      const data = await response.json();
      setMeetingData(data);

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

      const sortedAvailability = Object.entries(availabilityMap).sort(
        (a, b) => b[1] - a[1]
      );

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

  useEffect(() => {
    const fetchTop3Time = async () => {
      try {
        if (meetingData && meetingData.purpose) {
          const response = await axios.get(
            `/meetings/top-three-confirmed-times`,
            {
              params: { purpose: meetingData.purpose },
              withCredentials: true,
            }
          );
          setTopThreeConfirmedTimes(response.data.topThreeConfirmedTimes);
        }
      } catch (error) {
        console.error("Top 3 시간대 가져오기 실패:", error);
      }
    };

    fetchTop3Time();
  }, [meetingData]);
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const confirmSelectedTime = () => {
    if (!selectedDate) {
      alert("시간을 선택해주세요.");
      return;
    }

    const lastIndex = selectedDate.lastIndexOf("-");
    const date = selectedDate.substring(0, lastIndex);
    const timeIndex = selectedDate.substring(lastIndex + 1);

    const hours = Math.floor(parseInt(timeIndex) / 2);
    const minutes = (parseInt(timeIndex) % 2) * 30;

    const kstDate = new Date(
      `${date}T${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00.000+09:00`
    );

    const utcTimeISO = kstDate.toISOString();

    setSelectedDate(utcTimeISO);
    setIsModalOpen(true);
  };

  const handleRandomConfirm = () => {
    if (possibleDates.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleDates.length);
      const randomDateTime = possibleDates[randomIndex];

      const lastIndex = randomDateTime.lastIndexOf("-");
      const date = randomDateTime.substring(0, lastIndex);
      const timeIndex = randomDateTime.substring(lastIndex + 1);
      const hours = Math.floor(parseInt(timeIndex) / 2);
      const minutes = (parseInt(timeIndex) % 2) * 30;

      const kstDate = new Date(
        `${date}T${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:00.000+09:00`
      );

      const utcTimeISO = kstDate.toISOString();

      setSelectedDate(utcTimeISO);
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
      const response = await axios.patch(
        `/meetings/${meeting_id}/confirm-time`,
        {
          adminPassword: password,
          confirmedTime: selectedDate, // UTC로 조정된 시간
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
              약속 시간은 {formatKSTDateTime(meetingData.confirmedTime)}
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
              다른 사람들은 주로{" "}
              {topThreeConfirmedTimes
                .map((time) => `${time.hour}시`)
                .join(", ")}
              에 많이 만나요
            </p>

            <form className="form-container">
              {possibleDates.length > 0 ? (
                possibleDates.map((dateTime, index) => {
                  const lastIndex = dateTime.lastIndexOf("-");
                  const date = dateTime.slice(0, lastIndex);
                  const timeIndex = dateTime.slice(lastIndex + 1);

                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="date"
                        value={dateTime}
                        checked={selectedDate === dateTime}
                        onChange={handleDateChange}
                      />
                      {formatDateTime(date, parseInt(timeIndex))}
                    </label>
                  );
                })
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
