import React, { useState } from "react"
import MakeDay from "./MakeDay";
import MakeHeader from "./MakeHeader";

function MakeCell(props){//주차 데이터를 담을 공간
    const calendarArr = [];

    const startDay = new Date(props.nowYear, props.nowMonth - 1, 1);
    const lastDay = new Date(props.nowYear, props.nowMonth, 0);
    const lastMonthDate = new Date(props.nowYear, props.nowMonth - 1, 0).getDate();

    let nowDate = startDay.getDate();
    const lastDate = lastDay.getDate();

    // cellb는 이전 달이나 다음 달이라서 색을 연하게 칠하게 할 거고
    // cella는 이번 달이라서 진하게 색을 칠할 거임
    if(startDay.getDay() > 0){
        const tmpArr = [];
        for(let i = startDay.getDay(); i > 0; i--)tmpArr.push(
            <td className="cellb" onClick={()=>{alert("dd");}}>{lastMonthDate - i + 1}</td>
        );
        for(let i = startDay.getDay(); i < 7; i++){
            tmpArr.push(
                <td className="cella" onClick={()=>{alert("dd");}}>{nowDate}</td>
            )
            nowDate+=1;
        }
        calendarArr.push(
            <tr>{tmpArr}</tr>
        );
    }

    while(nowDate <= lastDate){
        const tmpArr = [];
        for(let i = 0; i < 7; i++){
            let tmp = nowDate;
            let cn = "cella";
            if(tmp > lastDate){
                cn = "cellb";
                tmp-=lastDate;
            }
            tmpArr.push(
                <td className={cn} onClick={()=>{alert("dd");}}>{tmp}</td>
            )
            nowDate+=1;
        }
        calendarArr.push(
            <tr>{tmpArr}</tr>
        );
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