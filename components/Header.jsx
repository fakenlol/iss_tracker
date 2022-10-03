import React from 'react';
import ReactDOM from 'react-dom/client';

export default function Parentheses(props) {
  return (
    <div style={{ width: "100%"}} className="navbar navbar-dark bg-dark  d-flex justify-content-between">
      <h2 style={{marginLeft: "2%", color: 'white'}}>
        THE BORING ISS TRACKER
      </h2>
      <input type="range" min="1" max="200" value="50" id="slider" />
      <ul style={{ marginRight: '2%'}} className="justify-content-end">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
            {props.children}
          </a>
        </li>
      </ul>
    </div>
   );
}
