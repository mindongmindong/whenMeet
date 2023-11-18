import React, { useState } from "react"
import './Calendar.css'
import MakeDay2 from "./MakeDay2";

function CaculateWeek(props){
    const startDay = new Date(props.nowYear, props.nowMonth - 1, 1);
    const lastDay = new Date(props.nowYear, props.nowMonth, 0);
    const firstDay = startDay.getDay();
    const lastDate = lastDay.getDate();

    const weekArr = [];
    const selectArr = [];

    weekArr.push(<td></td>);
    // 시작 끝 값을 수정해서 일정 변경
    for(let i = 0; i < 10; i++){
        const forSelect = [];
        const minute = i*30;
        const time = (String(Math.floor(minute/60)).padStart(2,"0"))+":"+(String(minute%60).padStart(2,"0"));

        for(let j = 0; j < 7; j++){
            const d = (props.week - 1) * 7 + j - firstDay+1;
            const newDate = new Date(props.nowYear, props.nowMonth-1, d);

            if(i===0){
                let cn = "cella";
                if(d < 1)cn = "cellb"
                else if(d > lastDate)cn = "cellb"
                
                weekArr.push(<td className={cn}>{newDate.getDate()}</td>);
            }

            forSelect.push(<td className="ttt" onClick={()=>console.log(newDate.toDateString(),i)}></td>);
        }

        selectArr.push(
            <tr key={i}>{time} {forSelect}</tr>
        );
    }

    return(
        <tbody>
            <tr>{weekArr}</tr>
            {selectArr}
        </tbody>
    );
}

function CalendarWeek2(){
    const [currentDay, setCurrentDay] = useState(new Date());
    
    // 일요일 0 시작
    const nowDay = currentDay.getDay();
    const nowDate = currentDay.getDate();
    const [nowMonth, setNowMonth] = useState(currentDay.getMonth() + 1); // zero-base
    const [nowYear, setNowYear] = useState(currentDay.getFullYear());
    const [nowWeek, setNowWeek] = useState(1);

    const firstDay = (new Date(nowYear, nowMonth - 1, 1)).getDay();
    const lastDay = (new Date(nowYear, nowMonth, 0)).getDay();

    let maxWeek = 5;
    if(firstDay > lastDay)maxWeek=6;

    const prevWeek = () => {
        let newWeek = nowWeek - 1;
        let newMonth = nowMonth;
        let newYear = nowYear;
        if(newWeek < 1){
            newWeek = maxWeek;
            newMonth = nowMonth - 1;
            if(newMonth < 1){
                newMonth = 12;
                newYear = nowYear - 1;
            }
        }

        const fd = (new Date(newYear, newMonth - 1, 1)).getDay();
        const ld = (new Date(newYear, newMonth, 0)).getDay();

        if(maxWeek === 6 && fd < ld)newWeek-=1;
        else if(maxWeek === 5 && fd > ld)newWeek+=1;

        setNowWeek(newWeek);
        setNowMonth(newMonth);
        setNowYear(newYear);
        setCurrentDay(new Date(nowYear, nowMonth - 1, 1*(nowWeek-1) + nowDay));
    }
    const nextWeek = () => {
        let newWeek = nowWeek + 1;
        let newMonth = nowMonth;
        let newYear = nowYear;
        if(newWeek > maxWeek){
            newWeek = 1;
            newMonth = nowMonth + 1;
            if(newMonth > 12){
                newMonth = 1;
                newYear = nowYear + 1;
            }
        }
        setNowWeek(newWeek);
        setNowMonth(newMonth);
        setNowYear(newYear);
        setCurrentDay(new Date(nowYear, nowMonth - 1, nowDate));
    }

    return(
        <div className="calendar">
            <div className="header">
                <h1>{nowMonth}월 {nowWeek}주차</h1>
                <button onClick={prevWeek}>prev</button>
                <button onClick={nextWeek}>next</button>
            </div>
            <h1>{nowYear}</h1>
            <table className="calendarTable">
                <MakeDay2/>
                <CaculateWeek week={nowWeek} currentDay={currentDay} nowYear={nowYear} nowMonth={nowMonth} />
            </table>
        </div>
    );
}

export default CalendarWeek2;