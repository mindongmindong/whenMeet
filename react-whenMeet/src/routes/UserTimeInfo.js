import { useState, useEffect } from "react";
import Button from "../components/Button";
import CalendarWeek2 from "../components/CalendarWeek2";
import "../styles/HomeMake.css";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function UserTimeInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState(true);
  const [availableSchedules, setAvailableSchedules] = useState(
    location.state.schedules
  );

  const at = [];
  for (let key of availableSchedules) {
    const date = new Date(key.availableDate) - 0;
    for (let t of key.availableTimes) {
      at.push(date + t);
    }
  }

  const [availableTimes, setAvailableTimes] = useState(at);
  const { id } = useParams();

  let st = 0;
  let et = 48;

  console.log(location.state.startTime, location.state.endTime);
  if (
    !(
      location.state.startTime === location.state.endTime &&
      location.state.startTime === "00:00:00"
    )
  ) {
    if (location.state.startTime) {
      st = location.state.startTime;
      const sta = st.split(":");
      st = sta[0] * 2 + sta[1] / 30;
    }
    if (location.state.endTime) {
      et = location.state.endTime;
      const eta = et.split(":");
      et = eta[0] * 2 + eta[1] / 30;
    }
  }

  const [startTime, setStartTime] = useState(st);
  const [endTime, setEndTime] = useState(et);

  const [today, setToday] = useState(new Date(location.state.startDate));
  const [startDate, setStartDate] = useState(
    new Date(location.state.startDate)
  );
  const [endDate, setEndDate] = useState(new Date(location.state.endDate));

  const handleState1 = () => {
    setState(true);
  };
  const handleState2 = () => {
    setState(false);
  };
  const handleCalendar = (value) => {
    console.log("Selected Date:", value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/meetings/${id}/`);
      const nd = response.data.startDate.split("-");
      setStartDate(new Date(nd[0] - 0, nd[1] - 1, nd[2] - 0));
      setToday(startDate);
      const ed = response.data.endDate.split("-");
      setEndDate(new Date(ed[0] - 0, ed[1] - 1, ed[2] - 0));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAlert = async () => {
    const sat = [];
    // state에 따라서 가능한 시간을 선택한 거라면 그냥 넘어가고
    // 불가능한 시간을 선택한 거라면 전부 날짜 범위에 맞춰서 뒤집어줘야 한다.
    // 여기 수정해야함
    if (!state) {
      for (
        let day = startDate - 0;
        day <= endDate - 0;
        day += 60 * 60 * 24 * 1000
      ) {
        for (let time = startTime; time < endTime; time++) {
          if (!availableTimes.includes(day + time)) {
            sat.push(day + time);
          }
        }
      }
    } else {
      sat.push(...availableTimes);
    }
    sat.sort();

    const aa = [];
    let t = [];
    let l = availableTimes[0];

    sat.forEach((em) => {
      if (parseInt(l / 100) !== parseInt(em / 100)) {
        t = [];
      }
      const newDate = new Date(parseInt(em));
      const availableDate =
        newDate.getFullYear() +
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        newDate.getDate();
      t.push(em % 100);
      aa.push({ availableDate: availableDate, availableTimes: t });
    });

    const groupedData = aa.reduce((acc, item) => {
      if (!acc[item.availableDate]) {
        acc[item.availableDate] = {
          availableDate: item.availableDate,
          availableTimes: new Set(item.availableTimes),
        };
      } else {
        item.availableTimes.forEach((time) =>
          acc[item.availableDate].availableTimes.add(time)
        );
      }
      return acc;
    }, {});

    const compressedData = Object.values(groupedData).map((item) => {
      return {
        availableDate: item.availableDate,
        availableTimes: [...item.availableTimes],
      };
    });

    setAvailableSchedules(compressedData);
    if (location.state.schedules) {
      try {
        const response = await axios.put(`/meetings/${id}/my/schedules/bulk`, {
          schedules: compressedData,
        });
        alert("제출 완료");
        navigate(`/result/${id}`);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Password를 잘못 입력하였습니다");
          } else if (error.response.status === 404) {
            alert("해당하는 이름이 존재하지 않습니다");
          } else if (error.response.status === 400) {
            alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요");
          } else {
            alert(`Unexpected status code: ${error.response.status}`);
          }
        } else {
          console.error(error);
        }
        alert("제출 실패");
      }
    } else {
      try {
        const response = await axios.post(`/meetings/${id}/my/schedules/bulk`, {
          schedules: compressedData,
        });
        alert("제출 완료");
        navigate(`/result/${id}`);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Password를 잘못 입력하였습니다");
          } else if (error.response.status === 404) {
            alert("해당하는 이름이 존재하지 않습니다");
          } else if (error.response.status === 400) {
            alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요");
          } else {
            alert(`Unexpected status code: ${error.response.status}`);
          }
        } else {
          console.error(error);
        }
      }
    }
  };

  const isContain = (value) => {
    return availableTimes.includes(value);
  };

  return (
    <div className="center-container">
      <div className="cc">
        <Button type="button" text="가능한 시간" onClick={handleState1} />
        <Button type="button" text="불가능한 시간" onClick={handleState2} />
      </div>
      <div className="cld">
        <CalendarWeek2
          state={state}
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          today={today}
          availableSchedules={availableSchedules}
          availableTimes={availableTimes}
          setAvailableTimes={setAvailableTimes}
          isContain={isContain}
        />
      </div>
      <div className="cc">
        <Button type="submit" text="시작하기" onClick={handleAlert} />
      </div>
    </div>
  );
}

export default UserTimeInfo;
