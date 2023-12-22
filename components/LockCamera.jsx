import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FiVideo, FiVideoOff } from "react-icons/fi";

export default function Parentheses({changeCamera}) {
  
  const [toggle, SetToggle] = useState(false)

  return (
  <div>
    <button type="button" onClick={changeCamera} className="d-inline-flex align-items-center btn btn-primary">Lock/Unlock
      <div style={{marginLeft: "10%"}}>
        {toggle ? <FiVideoOff/> : <FiVideo/>}
      </div>
    </button>
  </div> );
}
