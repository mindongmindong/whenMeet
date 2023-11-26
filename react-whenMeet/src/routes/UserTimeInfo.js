import { useState,useEffect } from "react";
import Button from "../components/Button";
import Calendar from "../components/Calendar"
import "../styles/HomeMake.css"
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function UserTimeInfo() {
    const [state, setState] = useState(true);


    const location = useLocation();
    const {id} = location.state;

    const handleState = () => {
        setState((state) => !state);
    }
    const handleCalendar = (value) => {
        console.log('Selected Date:', value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://43.200.79.42:3000/meetings/${id}/`);
                console.log(response.data.title);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]); 
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