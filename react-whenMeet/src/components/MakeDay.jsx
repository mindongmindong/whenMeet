export default function MakeDay(){
    const days = [];
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for(let i = 0; i < 7; i++){
        days.push(
            <th className="table_head">{date[i]}</th>
        )
    }

    return(
        <thead>
        <tr>
            {days}
        </tr>
        </thead>
    );
}