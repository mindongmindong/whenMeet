export default function MakeHeader({
  prevMonth,
  nextMonth,
  nowMonth,
  nowYear,
}) {
  return (
    <div className="header">
      <h2 className="calendarh2">
        <button type="button" onClick={prevMonth}>
          prev
        </button>
        {nowYear}년<br />
        {nowMonth}월
        <button type="button" onClick={nextMonth}>
          next
        </button>
      </h2>
    </div>
  );
}
