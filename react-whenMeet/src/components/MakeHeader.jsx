import Button from "./Button";

export default function MakeHeader({ prevMonth, nextMonth, nowMonth }) {
    return (
        <div>
            <h2>
                <span className="header">
                    <Button
                        type="button"
                        text="prev"
                        onClick={prevMonth}
                    />
                    {nowMonth}월
                    <Button
                        type="button"
                        text="next"
                        onClick={nextMonth}
                    />
                </span>
            </h2>
        </div>
    );
}
