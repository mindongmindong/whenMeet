import { useEffect } from "react";

export default function TableCell({k, cn, newDate, hds, hdw, hde, i, value}){
    // useEffect(() => { console.log(k)}, []);
    return(
        <td className={cn}
        key={k}
        id={k} 
        draggable
        onDragStart={()=>hds(newDate, i, k)}
        onDragEnter={()=>hdw(newDate, i, k)}
        onDragEnd={()=>hde(newDate, i)}
        onClick={()=>console.log(newDate.getMonth() + 1)}>
        {value} </td>
    );
}