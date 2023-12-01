import { useEffect } from "react";

export default function TableCell({k, cn, handleClick, newDate, hds, hdw, hde, i, value  }){
    if(cn==="noDate"){
        return(
            <td className={cn}
            key={k}
            id={k} >
            {value} </td>
        );
    }
    else{
        return(
            <td className={cn}
            key={k}
            id={k} 
            draggable
            onDragStart={()=>hds(newDate, i, k)}
            onDragEnter={()=>hdw(newDate, i, k)}
            onDragEnd={()=>hde(newDate, i)}
            onClick={()=>handleClick(newDate,i,k)}>
            {value} </td>
        );
    }
}