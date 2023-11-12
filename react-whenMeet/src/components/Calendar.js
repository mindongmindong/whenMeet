import React from 'react';
import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Input from './Input';

function Calendar({onChange}){    
    return(
        <div>
            <h2>달력</h2>
            <ReactCalendar onChange={onChange} />
        </div>
    );
}

export default Calendar;