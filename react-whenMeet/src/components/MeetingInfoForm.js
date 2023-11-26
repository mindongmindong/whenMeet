import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function MeetingInfoForm() {
    const [meetingPurpose, setMeetingPurpose] = useState("");
    const [number, setNumber] = useState();
    const [endVote, setEndVote] = useState("");
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const toDo = [
        '선택',
        '식사',
        '공부',
        '놀기',
        '기타'
    ];
    const navigate = useNavigate();
    const location = useLocation();
    const { title, password } = location.state;

    const [usingDate, setUsingDate] = useState([]);

    const handleOnChange = (event) => {
        setMeetingPurpose(event.target.value);
    }

    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };

    const handleNumber = (event) => {
        setNumber(event.target.value);
    }

    const handleVoteEnd = (event) => {
        setEndVote(event.target.value);
    }

    const handleStart = (event) => {
        setStart(event.target.value);
    }

    const handleEnd = (event) => {
        setEnd(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (meetingPurpose === "" || meetingPurpose === "선택") {
            alert("목적을 선택하세요");
        } else {
            try {
                const response = await axios.post("http://43.200.79.42:3000/meetings", {
                    title: title,
                    adminPassword: password,
                    purpose: meetingPurpose,
                    startDate: start,
                    endDate: end,
                    maxParticipants: number,
                    voteExpiresAt: endVote
                });
                const id = response.data.id;
                navigate("LinkPage",{state : {id}});
            } catch (error) {
                console.error("Error sending data to the backEnd", error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div className="purpose-selector">
                    <h1>약속 일정 만들기</h1>
                    <label>
                        목적:
                        <select value={meetingPurpose} onChange={handleOnChange}>
                            {toDo.map((todo, index) => (
                                <option key={index}>{todo}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <Calendar onChange={handleCalendar} usingDate={usingDate} setUsingDate={setUsingDate} />
                <div className="timeStartEnd">
                    시작:
                    <Input
                        type="date"
                        value={start}
                        onChange={handleStart}
                        placeholder="시작"
                    />
                    종료:
                    <Input
                        type="date"
                        value={end}
                        onChange={handleEnd}
                        placeholder="종료"
                    />

                </div>
                <Input
                    type="number"
                    value={number}
                    onChange={handleNumber}
                    placeholder="예상 투표 인원(선택)"
                />
                <Input
                    type="datetime-local"
                    value={endVote}
                    onChange={handleVoteEnd}
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
