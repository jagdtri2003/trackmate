import React from 'react'
import search from "../searching-loading.gif"

function Loader({granted}) {
  return (
    <div style={{height:'100vh',width:'100vw',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
        <img style={{height:'100px',width:'100px',marginTop:'-5vh'}} src={search} alt="" />
        <p style={{color:'black',fontSize:'18px',padding:'12px'}}>Turn on GPS & Please give permission to continue using map</p>
        {!granted && <p style={{color:'red',fontSize:'18px',padding:'12px',marginTop:"-6px"}}>Error: Permission denied by user !</p>}
    </div>
  )
}

export default Loader