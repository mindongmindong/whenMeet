import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import TimeInput from "./TimeInput";

import "../styles/MeetingInfo.css";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function MeetingInfoForm() {
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [number, setNumber] = useState();
  const [endVote, setEndVote] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startNum, setStartNum] = useState(0);
  const [endNum, setEndNum] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, password } = location.state;

  const [usingDate, setUsingDate] = useState({});

  const handleOnChange = (event) => {
    setMeetingPurpose(event.target.value);
  };

  const handleNumber = (event) => {
    const inputValue = event.target.value;
    if (inputValue > 0) {
      setNumber(inputValue);
    } else {
      setNumber("");
    }
  };

  const handleVoteEnd = (event) => {
    setEndVote(event.target.value);
  };

  const handleStartTimeChange = (selectedHour, selectedMinute) => {
    setStartNum(selectedHour * 2 + selectedMinute / 30);
    setStartTime(`${selectedHour}:${selectedMinute}:00`);
  };

  const handleEndTimeChange = (selectedHour, selectedMinute) => {
    setEndNum(selectedHour * 2 + selectedMinute / 30);
    setEndTime(`${selectedHour}:${selectedMinute}:00`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (meetingPurpose === "" || meetingPurpose === "선택") {
    } else {
      let transformedPurpose = meetingPurpose; // 기본값은 그대로 유지

      if (meetingPurpose === "스터디") {
        transformedPurpose = "STUDY";
      } else if (meetingPurpose === "회의") {
        transformedPurpose = "MEETING";
      } else if (meetingPurpose === "놀기") {
        transformedPurpose = "PLAYING";
      } else if (meetingPurpose === "식사") {
        transformedPurpose = "FOOD";
      } else if (meetingPurpose === "기타") {
        transformedPurpose = "ETC";
      }
      try {
        console.log(startTime);
        console.log(endTime);
        console.log(usingDate);
        const response = await axios.post("/meetings", {
          title: title,
          adminPassword: password,
          purpose: transformedPurpose,
          startDate: usingDate.startDate,
          endDate: usingDate.endDate,
          availableVotingStartTime: startTime,
          availableVotingEndTime: endTime,
          maxParticipants: number,
          voteExpiresAt: endVote,
        });
        const id = response.data.id;
        navigate("LinkPage", { state: { id } });
      } catch (error) {
        console.error("Error sending data to the backEnd", error);
      }
      console.log(meetingPurpose);
    }
  };

  const isFormValid = meetingPurpose.trim() !== "" && startNum < endNum;

  return (
    <form onSubmit={handleSubmit}>
      <div className="center-container2">
        <h1>약속 일정 만들기</h1>
        <div className="purpose">
          <h2 className="not-enter">약속 목적 </h2>
          <select
            className="purpose-selector"
            value={meetingPurpose}
            onChange={handleOnChange}
          >
            <option value="선택">선택</option>
            <option value="스터디">스터디</option>
            <option value="회의">회의</option>
            <option value="놀기">놀기</option>
            <option value="식사">식사</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="calendar-month">
          <Calendar usingDate={usingDate} setUsingDate={setUsingDate} />
        </div>
        <div className="form-input">
          <div className="timeStartEnd">
            <h2 className="availableVote">투표 가능 시간</h2>
            <TimeInput onTimeChange={handleStartTimeChange} />
            ~
            <TimeInput onTimeChange={handleEndTimeChange} />
          </div>
          <h2>추가 설정</h2>
          <div className="num-of-people">
            <h2 className="numVoter">
              투표 인원수<span className="selection">(선택)</span>
            </h2>
            <Input
              classname="voteNumber"
              type="number"
              value={number}
              onChange={handleNumber}
              placeholder="인원수"
            />
          </div>
          <div className="end-time">
            <h2 className="not-enter">
              투표 종료 시간<span className="selection">(선택)</span>
            </h2>
            <Input
              classname="vote-end"
              type="datetime-local"
              value={endVote}
              onChange={handleVoteEnd}
            />
          </div>
        </div>
        <Button type="submit" text="시작하기" disabled={!isFormValid} />
      </div>
    </form>
  );
}

export default MeetingInfoForm;
