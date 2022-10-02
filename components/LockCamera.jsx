import React from 'react';
import ReactDOM from 'react-dom/client';
import { FiVideo } from "react-icons/fi";

export default function Parentheses({changeCamera}) {
  
  return (
  <div>
    <button type="button" onClick={changeCamera} className="d-inline-flex align-items-center btn btn-primary">Lock/Unlock
      <div style={{marginLeft: "10%"}}>
        <FiVideo/>
      </div>
    </button>
  </div> );
}
