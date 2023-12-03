// import React, { useState, useEffect } from "react";
// import CalendarWeek from "./CalendarWeek";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// import "../styles/ResultMake.css";
// function ResultMakeForm() {
//   const [meetingData, setMeetingData] = useState(null);
//   const { meeting_id } = useParams();
//   const { currentParticipants, maxParticipants } = meetingData || {};
//   const navigate = useNavigate();
//   const [timeLeft, setTimeLeft] = useState("");
//   const [hoveredInfo, setHoveredInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     // 서버에서 미팅 데이터를 가져오는 함수
//     const fetchMeetingData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/meetings/${meeting_id}/details`,
//           {
//             withCredentials: true,
//           }
//         );
//         setMeetingData(response.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("데이터 로딩 에러:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchMeetingData();
//   }, [meeting_id]);

//   // 타이머를 시작하고 관리하는 로직
//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       if (!meetingData || !meetingData.voteExpiresAt) {
//         // meetingData나 voteExpiresAt이 없는 경우 기본값을 반환
//         return {
//           days: 0,
//           hours: 0,
//           minutes: 0,
//           seconds: 0,
//         };
//       }
//       const now = new Date();
//       const voteExpires = new Date(meetingData.voteExpiresAt);
//       const difference = voteExpires - now;

//       if (difference > 0) {
//         return {
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//           minutes: Math.floor((difference / 1000 / 60) % 60),
//           seconds: Math.floor((difference / 1000) % 60),
//         };
//       } else {
//         // 시간이 이미 지난 경우 기본값을 반환
//         return {
//           days: 0,
//           hours: 0,
//           minutes: 0,
//           seconds: 0,
//         };
//       }
//     };

//     const updateTimer = () => {
//       const newTimeLeft = calculateTimeLeft() || {}; // newTimeLeft가 undefined인 경우를 대비해 기본 객체 할당
//       const formattedTime = `${
//         newTimeLeft.days ? newTimeLeft.days + "일 " : ""
//       }${newTimeLeft.hours ? newTimeLeft.hours + "시간 " : ""}${
//         newTimeLeft.minutes ? newTimeLeft.minutes + "분 " : ""
//       }${newTimeLeft.seconds ? newTimeLeft.seconds + "초" : ""}`;
//       setTimeLeft(formattedTime);
//     };

//     updateTimer();
//     const timerId = setInterval(updateTimer, 1000);

//     return () => clearInterval(timerId);
//   }, [meetingData]);

//   const handleEdit = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/meetings/${meeting_id}/`
//       );
//       const {
//         startDate,
//         endDate,
//         availableVotingStartTime,
//         availableVotingEndTime,
//       } = response.data;

//       try {
//         const scheduleResponse = await axios.get(
//           `http://localhost:3000/meetings/${meeting_id}/my/schedules`
//         );
//         navigate("/UserTimeInfo", {
//           state: {
//             id: meeting_id,
//             startTime: availableVotingStartTime,
//             endTime: availableVotingEndTime,
//             startDate,
//             endDate,
//             schedules: scheduleResponse.data.schedules,
//           },
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const closeMeeting = async () => {
//     const adminPassword = prompt("관리자 비밀번호를 입력하세요:");

//     if (adminPassword) {
//       try {
//         await axios.post(`http://localhost:3000/meetings/${meeting_id}/close`, {
//           adminPassword,
//         });

//         navigate(`/resultend/${meeting_id}`);
//       } catch (error) {
//         if (error.response && error.response.status === 401) {
//           alert("비밀번호가 틀렸습니다.");
//         } else {
//           console.error("오류 발생:", error);
//         }
//       }
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handlePasswordConfirm = async (password) => {
//     setIsModalOpen(false);
//     try {
//       await axios.post(`http://localhost:3000/meetings/${meeting_id}/close`, {
//         adminPassword: password,
//       });
//       navigate(`/resultend/${meeting_id}`);
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         alert("비밀번호가 틀렸습니다.");
//       } else {
//         console.error("오류 발생:", error);
//       }
//     }
//   };

//   return (
//     <>
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="column-container">
//           <h1 className="title-box">{meetingData?.title}</h1>

//           <div>
//             현재 완료한 인원수 {currentParticipants}
//             {maxParticipants != null && ` / ${maxParticipants}`}
//           </div>

//           <div>종료까지 남은 시간 {timeLeft}</div>
//           <button onClick={handleEdit}>수정하기</button>
//           <button onClick={closeMeeting}>투표 종료하기</button>
//         </div>
//       )}
//       {meetingData && (
//         <span className="flex-row">
//           <div className="calander-container">
//             <CalendarWeek
//               participants={meetingData.participants}
//               startDate={meetingData.startDate}
//               endDate={meetingData.endDate}
//               currentParticipants={meetingData.currentParticipants}
//               maxParticipants={meetingData.maxParticipants}
//               hoveredInfo={hoveredInfo}
//               setHoveredInfo={setHoveredInfo}
//               availableVotingStartTime={meetingData.availableVotingStartTime}
//               availableVotingEndTime={meetingData.availableVotingEndTime}
//             />
//           </div>

//           <span className="mostTime">
//             <div style={{ textAlign: "center" }}>
//               가장 많은 사람들이 가능한 일정
//             </div>
//             <ol>//일정 5개 나열</ol>
//           </span>
//           <span className="possible">
//             {!hoveredInfo && (
//               <div>
//                 <strong>가능한 사람들이 표시됩니다.</strong>
//                 <p>마우스를 달력 위에 올려보세요!</p>
//               </div>
//             )}

//             {hoveredInfo && (
//               <div style={{ textAlign: "center" }}>
//                 <strong>
//                   {hoveredInfo.date} {hoveredInfo.time}에 가능한 사람:
//                 </strong>
//                 <ul>
//                   {hoveredInfo.participants.map((name) => (
//                     <li key={name}>{name}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </span>
//         </span>
//       )}
//     </>
//   );
// }
// export default ResultMakeForm;
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

  useEffect(() => {
    const fetchMeetingData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/meetings/${meeting_id}/details`,
          { withCredentials: true }
        );
        setMeetingData(response.data);
        setIsLoading(false);
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
      const now = new Date();
      const voteExpires = new Date(meetingData.voteExpiresAt);
      const difference = voteExpires - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
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
  }, [meetingData]);
  const handleEdit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/meetings/${meeting_id}/`
      );
      const {
        startDate,
        endDate,
        availableVotingStartTime,
        availableVotingEndTime,
      } = response.data;

      try {
        const scheduleResponse = await axios.get(
          `http://localhost:3000/meetings/${meeting_id}/my/schedules`
        );
        navigate("/UserTimeInfo", {
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
      await axios.patch(`http://localhost:3000/meetings/${meeting_id}/close`, {
        adminPassword: password,
      });
      navigate(`/resultend/${meeting_id}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("비밀번호가 틀렸습니다.");
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
          <div>
            현재 완료한 인원수 {meetingData?.currentParticipants} /{" "}
            {meetingData?.maxParticipants}
          </div>
          <div>종료까지 남은 시간 {timeLeft}</div>
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
    </>
  );
}

export default ResultMakeForm;
