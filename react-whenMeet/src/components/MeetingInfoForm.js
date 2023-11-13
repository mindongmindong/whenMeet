import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";

function MeetingInfoForm() {
    const [meetingPurpose, setMeetingPurpose] = useState("");
    const [number, setNumber] = useState();
    const [endTime, setEndTime] = useState("");
    const toDo = [
        '선택',
        '식사',
        '공부',
        '놀기',
        '기타'
    ];
    const navigate = useNavigate();

    const handleOnChange = (event) => {
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
        (meetingPurpose === "" || meetingPurpose === "선택") ? alert("목적을 선택하세요") : navigate("LinkPage");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1>약속 일정 만들기</h1>
                <label>
                    목적:
                    <select value={meetingPurpose} onChange={handleOnChange}>
                        {toDo.map((todo, index) => (
                            <option key={index}>{todo}</option>
                        ))}
                    </select>
                </label>
                <Calendar onChange={handleCalendar} />
                <Input
                    type="number"
                    value={number}
                    onChange={handleNumber}
                    placeholder="예상 투표 인원(선택)"
                />
                <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={handleEnd}
                />
                <Button
                    type="submit"
                    text="시작하기"
                />
            </div>
        </form>
    );
}

export default MeetingInfoForm;
