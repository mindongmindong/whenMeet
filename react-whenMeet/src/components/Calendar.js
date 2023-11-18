import React from "react";
import { useState } from "react";
import Input from "./Input";
import CalendarMonth from "./CalendarMonth";
//import CalendarWeek from './CalendarWeek';

function Calendar({ onChange }) {
  return (
    <div>
      <CalendarMonth />
    </div>
  );
}

export default Calendar;
