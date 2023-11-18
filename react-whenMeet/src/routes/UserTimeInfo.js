import { useState } from "react";
import Button from "../components/Button";
import Calendar from "../components/Calendar"
import "../styles/HomeMake.css"

function UserTimeInfo() {
    const [state, setState] = useState(true);

    const handleState = () => {
        setState((state) => !state);
    }
    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };
    return (
        <div className="center-container">
            <Button
                type="button"
                text="가능한 시간"
                onClick={handleState}
            />
            <Button
                type="button"
                text="불가능한 시간"
                onClick={handleState}
            />
            {state ? <Calendar
                onChange={handleCalendar}
            /> :
                <Calendar
                    onChange={handleCalendar}
                />
            }
        </div>
    );
}

export default UserTimeInfo;