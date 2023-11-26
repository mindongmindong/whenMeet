import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function HomeParticipateForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;

    const handleName = (event) => {
        setName(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }
    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    const checkParticipantExistence = async()=>{
        const response = await axios.get(`http://43.200.79.42:3000/meetings/${id}/participants/?name=${name}`);
        if(response.data){
            alert('이미 존재하는 이름입니다.')
        }
        return response.data.name;
    }

    const newHandleSubmit = async (event) => {
        event.preventDefault();
        if (name === "") {
            alert('이름을 입력하세요')
        }
        else {
            try {
                const response = await axios.post(`http://43.200.79.42:3000/meetings/${id}/participants`, {
                    name: name,
                    password: password,
                    email: email
                });
                navigate('UserTimeInfo', { state: { id } });
            }
            catch (error) {
                console.error(error);
            }
        }
    };
    const oldHandleSubmit = async (event) => {
        event.preventDefault();
        if (name === "") {
            alert('이름을 입력하세요')
        }
        else {
            try {
                const response = await axios.post(`http://43.200.79.42:3000/meetings/${id}/entry`,{
                    name : name,
                    password : password
                });
                if(response.status === 401 ){
                    alert('이름 또는 Password를 잘못 입력하였습니다');
                    return;
                }
                else if(response.status === 404){
                    alert('일치하는 참가자가 존재하지 않습니다');
                    return;
                }
                //navigate('UserTimeInfo', { state: { id } });
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        alert('이름 또는 Password를 잘못 입력하였습니다');
                    } else if (error.response.status === 404) {
                        alert('일치하는 참가자가 존재하지 않습니다');
                    } else {
                        alert(`Unexpected status code: ${error.response.status}`);
                    }
                } else {
                    // Handle other types of errors
                    console.error(error);
                }
                
            }
        }
    };

    return (
        <form>
            <div>
                <h1>투표에 참여하기</h1>
                {console.log({id})}
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
                    placeholder="Password"
                />
                <Input
                    type="text"
                    value={email}
                    onChange={handleEmail}
                    placeholder="이메일(선택)"
                />
                <Button
                    type='submit'
                    text='신규참여'
                    onClick={newHandleSubmit}
                />
                <Button
                    type='submit'
                    text='재참여'
                    onClick={oldHandleSubmit}
                />
            </div>
        </form>
    );
}

export default HomeParticipateForm;