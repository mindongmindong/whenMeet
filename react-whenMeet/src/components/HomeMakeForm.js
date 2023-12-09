import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../styles/HomeMake.css";
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
        navigate("/MeetingInfo", { state: { title, password } });
    };
    const isFormValid = title.trim() !== "" && password.trim() !== "";

    return (
        <form onSubmit={handleSubmit}>
            <div className="center-container">
                <div className="system-name">언제모임?</div>
                <h1>원하는 약속을 만들어보세요</h1>
                <Input
                    type="text"
                    value={title}
                    onChange={onTitleChange}
                    placeholder="약속 이름을 입력해주세요"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="관리용 비밀번호를 입력해주세요"
                />
                <Button
                    type="submit"
                    text="시작하기"
                    disabled={!isFormValid}
                />
            </div>
        </form>
    );
}

export default HomeMakeForm;
