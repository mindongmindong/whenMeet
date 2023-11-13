export default function MakeHeader(props){
    return(
        <div className="header">
            <h1>{props.nowMonth}월</h1>
            <button onClick={props.prevMonth}>prev</button>
            <button onClick={props.nextMonth}>next</button>
        </div>
    );
}