import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import "../styles/HomeMake.css"

function MeetingInfo() {
    const [meetingPurpose, setMeetingPurpose] = useState("");
    const [number, setNumber] = useState();
    const [endTime, setEndTime] = useState("");
    const navigate = useNavigate();

    const handleOnClick = (event) => {
        setMeetingPurpose(event.target.value);
    }
    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };
    const handleNumber = (event) => {
        setNumber(event.target.value);
    }
    const handleEnd = (event) => {
        setEndTime(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (meetingPurpose === "") {
            return alert("목적을 선택하세요");;
        }
        else {
            navigate("LinkPage");
        }
    }
    return (
        <div className="center-container">
            <form onSubmit={handleSubmit}>
                <h1>약속 일정 만들기</h1>
                <label>
                    목적: 
                    <select value={meetingPurpose} onClick={handleOnClick}>
                        <option>식사</option>
                        <option>공부</option>
                        <option>놀기</option>
                        <option>기타</option>
                    </select>
                </label>
                <Calendar onChange={handleCalendar} />
                <Input
                    type="number"
                    value={number}
                    onChange={handleNumber}
                    placeholder="예상 투표 인원"
                />
                <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={handleEnd}
                    placeholder="투표 종료 시간"
                />
                <Button
                    type="submit"
                    text="시작하기"
                />
            </form>
        </div>
    );
}

export default MeetingInfo;