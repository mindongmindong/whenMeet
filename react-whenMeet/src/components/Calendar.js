import React from "react";
import { useState } from "react";
import Input from "./Input";
import CalendarMonth from "./CalendarMonth";
// import CalendarWeek2 from './CalendarWeek2';

function Calendar({ onChange, usingDate, setUsingDate }) {
  return (
    <div>
      <CalendarMonth usingDate={usingDate} setUsingDate={setUsingDate} />
    </div>
  );
}

export default Calendar;
