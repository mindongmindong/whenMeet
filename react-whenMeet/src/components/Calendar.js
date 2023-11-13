import React from 'react';
import { useState } from 'react';
import Input from './Input';
import CalendarMonth from './CalendarMonth';
import CalendarWeek from './CalendarWeek';

function Calendar({onChange}){    
    return(
        <div>
            <h2>달력</h2>
            <CalendarMonth/>
        </div>
    );
}

export default Calendar;