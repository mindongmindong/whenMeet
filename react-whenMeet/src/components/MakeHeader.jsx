import Button from "./Button";

export default function MakeHeader({ prevMonth, nextMonth, nowMonth }) {
    return (
        <div>
            <h2>
                <span className="header">
                    <button
                        type="button"
                        onClick={prevMonth}
                    >prev</button>
                    {nowMonth}월
                    <button
                        type="button"
                        onClick={nextMonth}
                    >next</button>
                </span>
            </h2>
        </div>
    );
}
