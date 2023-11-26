import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function HomeMakeForm() {
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (title === "") {
            return alert("Title을 입력하세요");
        } else if (password === "") {
            return alert("Password를 입력하세요");
        } else {
            navigate("/MeetingInfo", {state : {title, password}});
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
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
                <br />
                <Button
                    type="submit"
                    text="시작하기"
                />
            </div>
        </form>
    );
}

export default HomeMakeForm;
