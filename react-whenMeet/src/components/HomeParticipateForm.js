import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function HomeParticipateForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();


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
        try{
            const response = await axios.get(`http://localhost:3000/meetings/${id}/participants/?name=${name}`);
            return false;
        }
        catch(err){
            return true;
        }
    }

    const newHandleSubmit = async (event) => {
        event.preventDefault();
        if (name === "") {
            alert('이름을 입력하세요')
        }
        else {
            let checkParticipant =  await checkParticipantExistence();
            if(checkParticipant){
                try {
                    const response = await axios.post(`http://localhost:3000/meetings/${id}/participants`, {
                        name: name,
                        password: password,
                        email: email
                    });
                    try {
                        const response = await axios.post(`http://localhost:3000/meetings/${id}/entry`,{
                            name : name,
                            password : password
                        }, {
                            withCredentials: true 
                        });

                        try{
                            const response = await axios.get(`http://localhost:3000/meetings/${id}/`);
                            navigate('UserTimeInfo', { state: { id:id, startDate: response.data.startDate, endDate:response.data.endDate }});
                        }
                        catch(e){
                            console.log(e);
                        }
                    }
                    catch (error) {
                        if (error.response) {
                            if (error.response.status === 401) {
                                alert('Password를 잘못 입력하였습니다');
                            } else if (error.response.status === 404) {
                                alert('해당하는 이름이 존재하지 않습니다');
                            } 
                            else if(error.response.status === 400){
                                alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요")
                            }
                            else {
                                alert(`Unexpected status code: ${error.response.status}`);
                            }
                        } else {
                            console.error(error);
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            else{
                alert('이미 존재하는 이름입니다.');
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
                const response = await axios.post(`http://localhost:3000/meetings/${id}/entry`,{
                    name : name,
                    password : password
                }, {
                    withCredentials: true 
                });
                try{
                    const response = await axios.get(`http://localhost:3000/meetings/${id}/`);
                    navigate('UserTimeInfo', { state: { id:id, startDate: response.data.startDate, endDate:response.data.endDate }});
                }
                catch(e){
                    console.log(e);
                }
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        alert('Password를 잘못 입력하였습니다');
                    } else if (error.response.status === 404) {
                        alert('해당하는 이름이 존재하지 않습니다');
                    } 
                    else if(error.response.status === 400){
                        alert("비밀번호를 설정하셨습니다. 비밀번호를 입력해주세요")
                    }
                    else {
                        alert(`Unexpected status code: ${error.response.status}`);
                    }
                } else {
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