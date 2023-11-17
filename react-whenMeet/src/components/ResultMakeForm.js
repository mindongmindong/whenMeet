//결과 확인 페이지
import React, { useState } from "react";
import CalendarWeek from "./CalendarWeek";
import { useNavigate } from "react-router-dom";

function ResultMakeForm() {
  const [title, setTitle] = useState("Title 예시");
  const [completedTasks, setCompletedTasks] = useState(3);
  const [totalTasks, setTotalTasks] = useState(7);
  const [timeLeft, setTimeLeft] = useState("00:37:30");
  const navigate = useNavigate();
  // 타이머를 시작하고 관리하는 로직

  const handleEdit = () => {
    navigate("/meetinginfo/linkpage");
  };

  return (
    <div>
      <h1 className="title-box">{title}</h1>
      <div>
        현재 완료한 일업수 {completedTasks} / {totalTasks}
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
      <CalendarWeek />
      <span className="mostTime">
        <div style={{ textAlign: "center" }}>
          가장 많은 사람들이 가능한 일정
        </div>
        <ol>//일정 5개 나열</ol>
      </span>
      <span className="possibleMan">
        <div style={{ textAlign: "center" }}>가능한 사람</div>
      </span>
    </div>
  );
}

export default ResultMakeForm;
