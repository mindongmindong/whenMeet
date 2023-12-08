import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";

function LinkPageForm() {
    const [link, setLink] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const {id} = location.state;


    const copyToClipboard = () => {
        const textToCopy = `localhost:3000/HomeParticipate/${id}`;
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = textToCopy;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('클립보드에 복사되었습니다');
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log({id});
        navigate(`/HomeParticipate/${id}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <p>hey</p>
                <Input
                    value={`localhost:3000/HomeParticipate/${id}`}
                />
                <Button
                    type="button"
                    onClick={copyToClipboard}
                    text="링크 복사"
                />
                <Button
                    type="submit"
                    text="투표 페이지로 이동"
                />
            </div>
        </form>
    );
}

export default LinkPageForm;