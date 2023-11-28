import React, { useState } from "react"
import MakeDay from "./MakeDay";
import MakeHeader from "./MakeHeader";
import TableCell from "./TableCell";

function MakeCell({ nowYear, nowMonth, usingDate, setUsingDate }){//주차 데이터를 담을 공간
    const calendarArr = [];

    const startDay = new Date(nowYear, nowMonth - 1, 1);
    const lastDay = new Date(nowYear, nowMonth, 0);
    const lastMonthDate = new Date(nowYear, nowMonth - 1, 0).getDate();

    let nowDate = startDay.getDate();
    const lastDate = lastDay.getDate();

    const [dragging, setDragging] = useState("nope");
    const [selectedDays, setSelectedDays] = useState([]); //선택된 날짜
    const [isDragging, setIsDragging] = useState(false); //드래그 여부
    const [dragStartDay, setDragStartDay] = useState(null); //드래그 시작 날짜
    const [dragEndDay, setDragEndDay] = useState();
    
    // 여기 달력 날짜 수정해야함
    const fDay = new Date(nowYear, nowMonth - 1, 1 - startDay.getDay()) - (0);
    const eDay = new Date(nowYear, nowMonth - 1, lastDate + 6 - lastDay.getDay()) - (0);

    let startDate="";
    let endDate="";

    const handleDragStart = (newDate, idx, comp) => {
        setIsDragging(!isDragging);
        setDragStartDay(newDate);
        for(let day = fDay; day <= eDay; day+=(60*60*24*1000)){
            const elm = document.getElementById(day);
            elm.classList.remove("dragging")
        }
    };

    const handleDragWhile = (newDate, idx, comp) => {
        if(!isDragging)return;
        setDragEndDay(newDate);

        let sd = dragStartDay - 0;
        let ed = newDate - 0;
        if(sd > ed){
            let tmp = sd;
            sd = ed;
            ed = tmp;
        }
        for(let day = fDay; day <= eDay; day+=(60*60*24*1000)){
            const elm = document.getElementById(day);
            elm.classList.remove("dragging")
        }
        const elm2 = document.getElementById(comp);
        if(elm2.classList.contains("dragging")){
            for(let day = ed; day >= comp; day -= (60*60*24*1000)){
                const elm = document.getElementById(day);
                elm.classList.remove("dragging")
            }
        }
        else {
            for(let day = sd; day <= ed; day += (60*60*24*1000)){
                const elm = document.getElementById(day);
                elm.classList.add("dragging")
            }
        }

    };

    const handleDragEnd = (newDate, idx) => {
        setIsDragging(false);
        setDragging("nope");
        if(dragStartDay - 0 < dragEndDay - 0){
            startDate = dragStartDay.getFullYear() + '-' + (dragStartDay.getMonth()+1) + '-' + dragStartDay.getDate();
            endDate = dragEndDay.getFullYear() + '-' + (dragEndDay.getMonth()+1) + '-' + dragEndDay.getDate();
        }
        else{
            endDate = dragStartDay.getFullYear() + '-' + (dragStartDay.getMonth()+1) + '-' + dragStartDay.getDate();
            startDate = dragEndDay.getFullYear() + '-' + (dragEndDay.getMonth()+1) + '-' + dragEndDay.getDate();
        }
        // console.log(startDate);
        // console.log(endDate);
        setUsingDate({startDate:startDate, endDate:endDate})
    };

    const handleClick = (newDate) => {
        for(let day = fDay; day <= eDay; day+=(60*60*24*1000)){
            const elm = document.getElementById(day);
            elm.classList.remove("dragging")
        }
        const elm = document.getElementById(newDate - 0);
        elm.classList.add("dragging")
        console.log(`${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`)
    }


    for(let day = fDay; day <= eDay; day += (60*60*24*1000)){
        const tmpArr = [];
        for(let i = 0; i < 7; i++){
            let cn = "cella";
            const newDate = new Date(day);
            if(newDate.getMonth() + 1 !== nowMonth) cn = "cellb";
            tmpArr.push(
                <TableCell k={day} cn={[cn, dragging].join(" ")} handleClick={handleClick} newDate={newDate} hds={handleDragStart} hdw={handleDragWhile} hde={handleDragEnd} i={i} value={newDate.getDate()}/>
            );
            day+=(60*60*24*1000)
        }
        calendarArr.push(
            <tr>{tmpArr}</tr>
        );

        day-=(60*60*24*1000)
    }

    
    return(
        <tbody>
            {calendarArr}
        </tbody>
    );
}

function CalendarMonth({ usingDate, setUsingDate }){
    const [currentDay, setCurrentDay] = useState(new Date());
    
    // 일요일 0 시작
    const nowDay = currentDay.getDay();
    const [nowDate, setNowDate] = useState(currentDay.getDate());
    const [nowMonth, setNowMonth] = useState(currentDay.getMonth() + 1); // zero-base
    const [nowYear, setNowYear] = useState(currentDay.getFullYear());

    const prevMonth = () => {
        let newMonth = nowMonth - 1;
        if(newMonth < 1){
            newMonth = nowMonth + 11;
            setNowYear(nowYear - 1);
        }
        setNowMonth(newMonth);
        setCurrentDay(new Date(nowYear, nowMonth, nowDate));
    }
    const nextMonth = () => {
        let newMonth = nowMonth + 1;
        if(newMonth > 12){
            newMonth = nowMonth - 11;
            setNowYear(nowYear + 1);
        }
        setNowMonth(newMonth);
        setCurrentDay(new Date(nowYear, nowMonth, nowDate));
    }

    return(
        <div className="calendar">
            <h1>달력</h1>
            <MakeHeader nowMonth={nowMonth} prevMonth={prevMonth} nextMonth={nextMonth}></MakeHeader>
            <h1>{nowYear}</h1>
            <table className="calendarTable">
                <MakeDay/> 
                <MakeCell nowYear={nowYear} nowMonth={nowMonth} usingDate={usingDate} setUsingDate={setUsingDate}></MakeCell>
            </table>
        </div>
    );
}

export default CalendarMonth;