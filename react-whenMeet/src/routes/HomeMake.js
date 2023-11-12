import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeMake.css";

function HomeMake() {
    const [title, setTitle] = useState("");
    const [password,setPassword] = useState("");

    const onTitleChange = (event) => {
        setTitle(event.target.value);
    }
    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div className="center-container">
            <form>
            <h1>When we meet?</h1>
                <Input
                    type="text"
                    value={title}
                    onChange={onTitleChange}
                    placeholder="약속 Title"
                />
                <br />
                <Input
                    type="text"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="관리용 Password"
                />
                <br/>
                <Link to="/MeetingInfo">
                    <Button
                        text="시작하기"
                    />
                </Link>
            </form>
        </div>
    );
}

export default HomeMake;