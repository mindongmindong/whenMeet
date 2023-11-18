import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function HomeParticipateForm() {
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const navigate = useNavigate();

    const handleName = (event)=>{
        setName(event.target.value);
    }
    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }
    const handleEmail = (event)=>{
        setEmail(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        name === "" ? alert('이름을 입력하세요') : navigate('UserTimeInfo');
    };

    return (
        <form>
            <div>
                <h1>약속 Title</h1>
                <Input 
                type="text"
                value={name}
                onChange={handleName}
                placeholder="이름"
                />
                <Input 
                type="password"
                value={password}
                onChange={handlePassword}
                placeholder="Password(선택)"
                />
                <Input 
                type="text"
                value={email}
                onChange={handleEmail}
                placeholder="이메일(선택)"
                />
                <Button
                type='submit'
                text='다음'
                onClick={handleSubmit}
                />
            </div>
        </form>
    );
}

export default HomeParticipateForm;