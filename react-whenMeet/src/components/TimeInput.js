import { useState } from "react";

function TimeInput({ onTimeChange }) {
    const [time, setTime] = useState("");

    const handleTimeChange = (event) => {
        setTime(event.target.value);  // select의 value를 그대로 저장
        onTimeChange(event.target.value.slice(0, 2), event.target.value.slice(3));
    };

    return (
        <div>
            <label>
                <select value={time} onChange={handleTimeChange}>
                    {Array.from({ length: 48 }, (_, i) => {
                        const paddedHour = Math.floor(i / 2).toString().padStart(2, "0");
                        const paddedMinute = (i % 2 === 0 ? "00" : "30");
                        return `${paddedHour}:${paddedMinute}`;
                    }).map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default TimeInput;
