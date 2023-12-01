import { useState } from "react";
function TimeInput({onTimeChange}) {
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");

    const handleHoursChange = (event) => {
        setHours(event.target.value);
        onTimeChange(event.target.value, minutes);
    };

    const handleMinutesChange = (event) => {
        setMinutes(event.target.value);
        onTimeChange(hours, event.target.value);
    };


    return (
        <div>
            <label>
                시:
                <select value={hours} onChange={handleHoursChange}>
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                분:
                <select value={minutes} onChange={handleMinutesChange}>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
export default TimeInput;