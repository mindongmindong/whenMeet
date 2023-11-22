import React, { useState } from "react"
import MakeDay from "./MakeDay";
import MakeHeader from "./MakeHeader";
import TableCell from "./TableCell";

function MakeCell(props){//주차 데이터를 담을 공간
    const calendarArr = [];

    const startDay = new Date(props.nowYear, props.nowMonth - 1, 1);
    const lastDay = new Date(props.nowYear, props.nowMonth, 0);
    const lastMonthDate = new Date(props.nowYear, props.nowMonth - 1, 0).getDate();

    let nowDate = startDay.getDate();
    const lastDate = lastDay.getDate();

    const [dragging, setDragging] = useState("nope");
    const [selectedDays, setSelectedDays] = useState([]); //선택된 날짜
    const [isDragging, setIsDragging] = useState(false); //드래그 여부
    const [dragStartDay, setDragStartDay] = useState(null); //드래그 시작 날짜
    const [dragEndDay, setDragEndDay] = useState();
    
    // 여기 달력 날짜 수정해야함
    const fDay = new Date(props.nowYear, props.nowMonth - 1, 1 - startDay.getDay()) - (0);
    const eDay = new Date(props.nowYear, props.nowMonth - 1, lastDate + 6 - lastDay.getDay()) - (0);

    const handleDragStart = (newDate, idx, comp) => {
        setIsDragging(!isDragging);
        // console.log(newDate.toDateString(), idx);
        setDragStartDay(newDate);
        for(let day = fDay; day <= eDay; day+=(60*60*24*1000)){
            const elm = document.getElementById(day);
            elm.classList.remove("dragging")
        }
        console.log(comp);
    };
    const handleDragWhile = (newDate, idx, comp) => {
        if(!isDragging)return;
        // setDragging("dragging");
        // dragging = "dragging";
        console.log(newDate.toDateString(), idx, dragging);
 
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
                // if(elm.classList.contains("dragging"))elm.classList.remove("dragging");
                // else elm.classList.add("dragging")
                elm.classList.remove("dragging")
            }
        }
        else {
            for(let day = sd; day <= ed; day += (60*60*24*1000)){
                const elm = document.getElementById(day);
                // if(elm.classList.contains("dragging"))elm.classList.remove("dragging");
                // else elm.classList.add("dragging")
                elm.classList.add("dragging")
            }
        }

    };
    const handleDragEnd = (newDate, idx) => {
        setIsDragging(false);
        setDragging("nope");
        // dragging ="";
        // console.log(newDate.toDateString(), idx, dragging);

        console.log(dragStartDay);
        console.log(dragEndDay);
        console.log(Math.abs(dragEndDay - dragStartDay)/(60*60*24*1000));
    };


    for(let day = fDay; day <= eDay; day += (60*60*24*1000)){
        const tmpArr = [];
        for(let i = 0; i < 7; i++){
            let cn = "cella";
            const newDate = new Date(day);
            if(newDate.getMonth() + 1 !== props.nowMonth) cn = "cellb";
            tmpArr.push(
                <TableCell k={day} cn={[cn, dragging].join(" ")} newDate={newDate} hds={handleDragStart} hdw={handleDragWhile} hde={handleDragEnd} i={i} value={newDate.getDate()}/>
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

function CalendarMonth(){
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
                <MakeCell nowYear={nowYear} nowMonth={nowMonth}></MakeCell>
            </table>
        </div>
    );
}

export default CalendarMonth;