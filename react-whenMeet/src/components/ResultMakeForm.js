import React, { useState, useEffect } from "react";
import CalendarWeek from "./CalendarWeek";
import PasswordModal from "./PasswordModal";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ResultMake.css";

function ResultMakeForm() {
  const [meetingData, setMeetingData] = useState(null);
  const { meeting_id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostAvailableDates, setMostAvailableDates] = useState([]);
  const [topAvailableDates, setTopAvailableDates] = useState([]);

  useEffect(() => {
    if (meetingData && meetingData.participants) {
      calculateTopAvailableDates();
    }
  }, [meetingData]);

  const calculateTopAvailableDates = () => {
    let dateAvailability = {};

    meetingData.participants.forEach((participant) => {
      participant.availableSchedules.forEach((schedule) => {
        if (!dateAvailability[schedule.availableDate]) {
          dateAvailability[schedule.availableDate] = {};
        }
        schedule.availableTimes.forEach((time) => {
          if (!dateAvailability[schedule.availableDate][time]) {
            dateAvailability[schedule.availableDate][time] = 0;
          }
          dateAvailability[schedule.availableDate][time]++;
        });
      });
    });

    let dateCounts = Object.entries(dateAvailability).map(([date, times]) => {
      let maxCount = Math.max(...Object.values(times));
      let count = Object.values(times).filter((val) => val === maxCount).length;
      return { date, count, maxCount };
    });

    dateCounts.sort((a, b) => b.maxCount - a.maxCount || b.count - a.count);

    setTopAvailableDates(dateCounts.slice(0, 5));
  };

  useEffect(() => {
    if (meetingData && meetingData.participants) {
      calculateMostAvailableDates();
    }
  }, [meetingData]);

  const calculateMostAvailableDates = () => {
    let dateAvailabilityCount = {};

    meetingData.participants.forEach((participant) => {
      participant.availableSchedules.forEach((schedule) => {
        if (!dateAvailabilityCount[schedule.availableDate]) {
          dateAvailabilityCount[schedule.availableDate] = new Set();
        }
        schedule.availableTimes.forEach((time) => {
          dateAvailabilityCount[schedule.availableDate].add(time);
        });
      });
    });

    const sortedDates = Object.entries(dateAvailabilityCount)
      .map(([date, times]) => ({ date, count: times.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setMostAvailableDates(sortedDates);
  };
  useEffect(() => {
    const fetchMeetingData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/meetings/${meeting_id}/details`, {
          withCredentials: true,
        });
        setMeetingData(response.data);
        setIsLoading(false);

        if (
          response.data.currentParticipants === response.data.maxParticipants
        ) {
          navigate(`/resultend/${meeting_id}`);
        }
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
        setIsLoading(false);
      }
    };

    fetchMeetingData();
  }, [meeting_id]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!meetingData || !meetingData.voteExpiresAt) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const voteExpiresKST = new Date(meetingData.voteExpiresAt);
      const now = new Date();
      const nowKST = new Date(now.getTime()); // UTC 시간에 9시간을 더해 KST로 조정
      const difference = voteExpiresKST - nowKST;
      if (difference <= 0) {
        navigate(`/resultend/${meeting_id}`);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
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

    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [meetingData, navigate, meeting_id]);

  const handleEdit = async () => {
    try {
      const response = await axios.get(`/meetings/${meeting_id}/`);
      const {
        startDate,
        endDate,
        availableVotingStartTime,
        availableVotingEndTime,
      } = response.data;

      try {
        const scheduleResponse = await axios.get(
          `/meetings/${meeting_id}/my/schedules`
        );
        navigate(`/homeparticipate/${meeting_id}/usertimeinfo/`, {
          state: {
            id: meeting_id,
            startTime: availableVotingStartTime,
            endTime: availableVotingEndTime,
            startDate,
            endDate,
            schedules: scheduleResponse.data.schedules,
          },
        });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeMeeting = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePasswordSubmit = async (password) => {
    setIsModalOpen(false);
    try {
      await axios.patch(`/meetings/${meeting_id}/close`, {
        adminPassword: password,
      });
      navigate(`/resultend/${meeting_id}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("비밀번호가 틀렸습니다.");
      } else if (error.response && error.response.status === 409) {
        alert("이미 종료된 투표입니다.");
      } else {
        console.error("오류 발생:", error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="column-container">
          <h1 className="title-box">{meetingData?.title}</h1>
          {meetingData.maxParticipants && (
            <div>
              현재 완료한 인원수 : {meetingData?.currentParticipants} /{" "}
              {meetingData?.maxParticipants}
            </div>
          )}
          {!meetingData.maxParticipants && (
            <div>현재 완료한 인원수 : {meetingData?.currentParticipants}</div>
          )}

          {meetingData.voteExpiresAt && (
            <div>종료까지 남은 시간 : {timeLeft}</div>
          )}
          <button onClick={handleEdit}>수정하기</button>
          <button onClick={closeMeeting}>투표 종료하기</button>
        </div>
      )}
      {meetingData && (
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
      )}
      <PasswordModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onSubmit={handlePasswordSubmit}
      />
      <div className="flex-bottom-container">
        <span className="mostTime">
          <strong style={{ textAlign: "center" }}>
            가장 많은 사람들이 가능한 일정
          </strong>
          <ol>
            {topAvailableDates.map((dateInfo, index) => (
              <li key={index}>
                {dateInfo.date} ({dateInfo.maxCount}명이 가능한 시간대:{" "}
                {dateInfo.count}개 )
              </li>
            ))}
          </ol>
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
      </div>
    </>
  );
}

export default ResultMakeForm;
