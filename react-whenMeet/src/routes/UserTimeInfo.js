import { useState } from "react";
import Button from "../components/Button";
import CalendarWeek2 from "../components/CalendarWeek2"
import "../styles/HomeMake.css"

function UserTimeInfo() {
    const [state, setState] = useState(true);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    const handleState = () => {
        setState((state) => !state);
    }
    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };
    const handleAlert = () => {
        let sat = [...availableTimes].sort();

        const aa = [];
        let t = [];
        let l = availableTimes[0];

        sat.forEach((em) => {
            if(parseInt(l/10)!==parseInt(em/10)){
                t=[];
            }
            l = em;
            const newDate = new Date(parseInt(em));
            const availableDate = newDate.getFullYear() + '-' + newDate.getMonth() + '-' + newDate.getDate();
            t.push(em%10);
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
            {/* {state ? <Calendar
                onChange={handleCalendar}
            /> :
                <Calendar
                    onChange={handleCalendar}
                />
            } */}
            <CalendarWeek2 state={state} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} isContain={isContain} />
            <Button
                type="submit"
                text="시작하기"
                onClick={handleAlert}
            />
        </div>
    );
}

export default UserTimeInfo;