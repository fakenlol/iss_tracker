import React from 'react';
import ReactDOM from 'react-dom/client';
 
export default function Parentheses({changeCamera}) {
  return (
  <div>
    <button type="button" onClick={changeCamera} className="btn btn-primary">Primary</button>
  </div> );
}
