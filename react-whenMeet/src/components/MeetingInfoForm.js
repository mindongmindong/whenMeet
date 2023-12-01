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
    const navigate = useNavigate();
    const location = useLocation();
    const { title, password } = location.state;

    const [usingDate, setUsingDate] = useState({});

    const handleOnChange = (event) => {
        setMeetingPurpose(event.target.value);
    }

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
        }
        else {
            let transformedPurpose = meetingPurpose; // 기본값은 그대로 유지

            if (meetingPurpose === "스터디") {
                transformedPurpose = 'STUDY';
            } else if (meetingPurpose === '회의') {
                transformedPurpose = 'MEETING';
            } else if (meetingPurpose === '놀기') {
                transformedPurpose = 'PLAYING';
            } else if (meetingPurpose === '식사') {
                transformedPurpose = 'FOOD';
            } else if (meetingPurpose === '기타') {
                transformedPurpose = 'ETC';
            }
            try {
                const response = await axios.post("http://localhost:3000/meetings", {
                    title: title,
                    adminPassword: password,
                    purpose: transformedPurpose,
                    startDate: usingDate.startDate,
                    endDate: usingDate.endDate,
                    maxParticipants: number,
                    voteExpiresAt: endVote
                });
                const id = response.data.id;
                navigate("LinkPage", { state: { id } });
            } catch (error) {
                console.error("Error sending data to the backEnd", error);
            }
            console.log(meetingPurpose);
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
                            <option value="선택">선택</option>
                            <option value="스터디">스터디</option>
                            <option value="회의">회의</option>
                            <option value="놀기">놀기</option>
                            <option value="식사">식사</option>
                            <option value="기타">기타</option>
                        </select>
                    </label>
                </div>

                <Calendar usingDate={usingDate} setUsingDate={setUsingDate} />
                <div className="timeStartEnd">
                    시작:
                    <Input
                        type="time"
                        value={start}
                        onChange={handleStart}
                        placeholder="시작"
                    />
                    종료:
                    <Input
                        type="time"
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
