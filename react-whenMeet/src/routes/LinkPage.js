import {useState, useEffect} from "react";
import "../styles/HomeMake.css"
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function LinkPage() {
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    const generateLink = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const linkLength = 10;

        let randomLink = '';
        for (let i = 0; i < linkLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomLink += characters[randomIndex];
        }
        setLink(randomLink);
    };

    const copyToClipboard = () => {
        const textField = document.createElement('textarea');
        textField.innerText = `localhost:3000/UserTimeInfo/${link}`;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        document.body.removeChild(textField);
        alert('링크가 복사되었습니다.');
    };

    const handleSubmit = (event)=>{
        event.preventDefault();
        navigate(`/UserTimeInfo/${link}`);
    }
    useEffect(()=>{
        generateLink();
    },[])
        return (
            <div className="center-container">
                <form onSubmit={handleSubmit}>
                    <Input
                    value={`localhost:3000/UserTimeInfo/${link}`}
                    />
                    <Button
                    type= "button"
                    onClick={copyToClipboard}
                    text= "링크 복사"
                    />
                    <Button
                    type= "submit"
                    text = "투표 페이지로 이동"
                    />
                </form>

            </div>
        );
    }

    export default LinkPage;