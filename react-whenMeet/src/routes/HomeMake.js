import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomeMake.css";

function HomeMake() {
    const [title, setTitle] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const onTitleChange = (event) => {
        setTitle(event.target.value);
    }
    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        if(title === ""){
            return alert("Title을 입력하세요");;
        }
        else if(password === ""){
            return alert("Password를 입력하세요");;
        }
        else{
            navigate("/MeetingInfo");
        }
    }

    return (
        <div className="center-container">
            <form onSubmit={handleSubmit}>
            <h1>When we meet?</h1>
                <Input
                    type="text"
                    value={title}
                    onChange={onTitleChange}
                    placeholder="약속 Title"
                />
                <br />
                <Input
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="관리용 Password"
                />
                <br/>
                <Button
                    type="submit"
                    text="시작하기"
                />
            </form>
        </div>
    );
}

export default HomeMake;