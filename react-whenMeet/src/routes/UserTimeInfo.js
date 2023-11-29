import { useState,useEffect } from "react";
import Button from "../components/Button";
import CalendarWeek2 from "../components/CalendarWeek2"
import "../styles/HomeMake.css"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UserTimeInfo() {
    const [state, setState] = useState(true);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const {id} = useParams();

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTiem] = useState(48);
    const [today, setToday] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date(2023,10,30));
    const [endDate, setEndDate] = useState(new Date(2023,11,4));
    
    
    const handleState = () => {
        setState((state) => !state);
    }
    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://43.200.79.42:3000/meetings/${id}/`);
                console.log(response.data.title);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleAlert = () => {
        let sat = [...availableTimes].sort();
        console.log(availableTimes);

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
                onClick={handleState}
            />
            <Button
                type="button"
                text="불가능한 시간"
                onClick={handleState}
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