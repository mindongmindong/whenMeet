import React, { useState } from "react"
import '../styles/Calendar.css'
import MakeDay2 from "./MakeDay2";
import TableCell from "./TableCell";

function CaculateWeek({ nowYear, nowMonth, week, availableTimes, setAvailableTimes, isContain, startDate, endDate, startTime, endTime}){
    const startDay = new Date(nowYear, nowMonth - 1, 1);
    const lastDay = new Date(nowYear, nowMonth, 0);
    const firstDay = startDay.getDay();
    const lastDate = lastDay.getDate();

    const [dragging, setDragging] = useState();
    const [isDragging, setIsDragging] = useState(false); //드래그 여부
    
    // 여기 달력 날짜 수정해야함
    const fDay = new Date(nowYear, nowMonth-1, (week-1)*7-firstDay+1) - (0); 
    const eDay = fDay + (60*60*24*1000)*6;

    const handleDragStart = () => {
        setIsDragging(!isDragging);
    };

    const doCheck=[...availableTimes];
    const handleDragWhile = (newDate, idx, comp) => {
        if(!isDragging)return;

        console.log(newDate-0+idx);

        const elm2 = document.getElementById(comp);
        if(elm2.classList.contains("dragging")){
            const elm = document.getElementById(newDate-0+idx);
            elm.classList.remove("dragging")
            doCheck.filter(key=>key!==newDate-0+idx);
        }
        else {
            const elm = document.getElementById(newDate-0+idx);
            elm.classList.add("dragging")
            doCheck.push(newDate-0+idx);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setAvailableTimes(doCheck)
        setDragging();
    };

    const handleClick = () => {
        for(let day = fDay; day <= eDay; day+=(60*60*24*1000)){
            for(let indx = 0; indx < 10; indx++){
                const elm = document.getElementById(day + indx);
                elm.classList.remove("dragging")
            }
        }
        setAvailableTimes([])
    }

    const weekArr = [];
    const selectArr = [];

    weekArr.push(<td></td>);
    // 시작 끝 값을 수정해서 일정 변경
    for(let i = startTime; i < endTime; i++){
        const forSelect = [];
        const minute = i*30;
        const time = (String(Math.floor(minute/60)).padStart(2,"0"))+":"+(String(minute%60).padStart(2,"0"));

        for(let j = 0; j < 7; j++){
            const d = (week - 1) * 7 + j - firstDay+1;
            const newDate = new Date(nowYear, nowMonth-1, d);

            if(i===0){
                let cn = "cella";
                if(d < 1)cn = "cellb"
                else if(d > lastDate)cn = "cellb"
                
                weekArr.push(<td className={cn}>{newDate.getDate()}</td>);
            }
            // console.log(newDate, startDate, endDate);
            if(newDate < startDate || newDate > endDate){
                forSelect.push(
                    <TableCell k={newDate - 0 + i} cn={"noDate"} newDate={newDate} i={i}/>
                );
            }
            else{
                if(isContain(newDate-0+i)){
                    forSelect.push(
                        <TableCell k={newDate - 0 + i} cn={"dragging"} newDate={newDate} handleClick={handleClick} hds={handleDragStart} hdw={handleDragWhile} hde={handleDragEnd} i={i}/>
                    );
                }
                else{
                    forSelect.push(
                        <TableCell k={newDate - 0 + i} newDate={newDate} handleClick={handleClick} hds={handleDragStart} hdw={handleDragWhile} hde={handleDragEnd} i={i}/>
                    );
                }
            }
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

function CalendarWeek2({ availableTimes, setAvailableTimes, isContain, startDate, endDate, startTime, endTime, today }){
    const [currentDay, setCurrentDay] = useState(today);
    
    // 일요일 0 시작
    const nowDay = currentDay.getDay();
    const nowDate = currentDay.getDate();
    const [nowMonth, setNowMonth] = useState(currentDay.getMonth() + 1); // zero-base
    const [nowYear, setNowYear] = useState(currentDay.getFullYear());

    const getWeek = (date) => {
        const currentDate = date.getDate();
        const firstDay = new Date(date.setDate(1)).getDay();
      
        return Math.ceil((currentDate + firstDay) / 7);
    };
      
    const [nowWeek, setNowWeek] = useState(getWeek(today));

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
                <CaculateWeek week={nowWeek} nowYear={nowYear} nowMonth={nowMonth} startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} isContain={isContain} />
            </table>
        </div>
    );
}

export default CalendarWeek2;