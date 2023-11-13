import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function LinkPageForm() {
    const [random, setRandom] = useState("");
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    const generateRandom = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const linkLength = 10;

        let randomLink = '';
        for (let i = 0; i < linkLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomLink += characters[randomIndex];
        }
        setRandom(randomLink);
    };

    const copyToClipboard = async (link) => {
        try {
            const textToCopy = `localhost:3000/HomeParticipate/${random}`;
            await navigator.clipboard.writeText(textToCopy);
            alert('클립보드에 복사되었습니다');
        } catch (err) {
            alert('클립보드 복사에 실패하였습니다');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLink(`/HomeParticipate/${random}`)
        navigate(link);
    }
    useEffect(() => {
        generateRandom();
    }, [])
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Input
                    value={`localhost:3000/HomeParticipate/${random}`}
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