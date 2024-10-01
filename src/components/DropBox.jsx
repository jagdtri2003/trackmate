import React,{useState} from 'react'

function DropBox({setOption,playing,setPlaying}) {

    const [op,setOp] = useState("today");
    const handleClick = () => {
        setPlaying((prev) => !prev);
    }
  return (
    <div className="dropdown-container">
        <label style={{fontSize:'16px'}} htmlFor="date-selector">Select Date: </label>
        <select id="date-selector" onChange={(e) => {setOption(e.target.value) 
            setOp(e.target.value)
        }}>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
        </select>
        {op === "yesterday" && (<button style={{marginLeft:'10px',padding:'5px'}} onClick={handleClick}>{playing ? "Stop" : "Start"}</button>)}
    </div>
  )
}

export default DropBox