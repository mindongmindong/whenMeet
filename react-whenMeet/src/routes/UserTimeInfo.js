import { useState,useEffect } from "react";
import Button from "../components/Button";
import CalendarWeek2 from "../components/CalendarWeek2"
import "../styles/HomeMake.css"
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function UserTimeInfo() {
    const [state, setState] = useState(true);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const {id} = useParams();

    const location = useLocation();

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(10);

    const [today, setToday] = useState(new Date(location.state.startDate));
    const [startDate, setStartDate] = useState(new Date(location.state.startDate));
    const [endDate, setEndDate] = useState(new Date(location.state.endDate));
    
    const handleState1 = () => {
        setState(true);
    }
    const handleState2 = () => {
        setState(false);
    }
    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/meetings/${id}/`);
            const nd = response.data.startDate.split("-");
            setStartDate(new Date(nd[0]-0,nd[1]-1,nd[2]-0));
            setToday(startDate);
            const ed = response.data.endDate.split("-");
            setEndDate(new Date(ed[0]-0,ed[1]-1,ed[2]-0));
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleAlert = () => {
        const sat = [];
        // state에 따라서 가능한 시간을 선택한 거라면 그냥 넘어가고
        // 불가능한 시간을 선택한 거라면 전부 날짜 범위에 맞춰서 뒤집어줘야 한다.
        // 여기 수정해야함
        if(!state){
            for(let day = startDate - 0; day <= endDate - 0; day+=((60*60*24*1000))){
                for(let time = startTime; time < endTime; time++){
                    if(!availableTimes.includes(day+time)){
                        sat.push(day+time);
                    }
                }
            }
        }
        else{
            sat.push(...availableTimes);
        }
        sat.sort();
        console.log(state, sat);

        const aa = [];
        let t = [];
        let l = availableTimes[0];

        sat.forEach((em) => {
            if(parseInt(l/100)!==parseInt(em/100)){
                t=[];
            }
            const newDate = new Date(parseInt(em));
            const availableDate = newDate.getFullYear() + '-' + (newDate.getMonth()+1) + '-' + newDate.getDate();
            t.push(em%100);
            aa.push({availableDate: availableDate, availableTimes: t})
        });

        const groupedData = aa.reduce((acc, item) => {
            if (!acc[item.availableDate]) {
              acc[item.availableDate] = { availableDate: item.availableDate, availableTimes: new Set(item.availableTimes) };
            } else {
              item.availableTimes.forEach(time => acc[item.availableDate].availableTimes.add(time));
            }
            return acc;
        }, {});
          
        const compressedData = Object.values(groupedData).map(item => {
        return { availableDate: item.availableDate, availableTimes: [...item.availableTimes] };
        });
        
        setAvailableSchedules(compressedData);
        console.log(availableSchedules);
        
        console.log(state);
    }

    const isContain = (value) => {
        return availableTimes.includes(value);
    }

    return (
        <div className="center-container">
            <Button
                type="button"
                text="가능한 시간"
                onClick={handleState1}
            />
            <Button
                type="button"
                text="불가능한 시간"
                onClick={handleState2}
            />
            <CalendarWeek2 state={state} startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} today={today} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} isContain={isContain} />
            <Button
                type="submit"
                text="시작하기"
                onClick={handleAlert}
            />
        </div>
    );
}

export default UserTimeInfo;