import Button from "./Button";

export default function MakeHeader({
  prevMonth,
  nextMonth,
  nowMonth,
  nowYear,
}) {
  return (
    <div>
      <h2>
        <span className="header">
          <button type="button" onClick={prevMonth}>
            prev
          </button>
          {nowYear}년<br />
          {nowMonth}월
          <button type="button" onClick={nextMonth}>
            next
          </button>
        </span>
      </h2>
    </div>
  );
}
