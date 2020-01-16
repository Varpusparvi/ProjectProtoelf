import React from 'react';
import starmap from './starmap.png';
import {useState} from 'react';
/*
* Protoelf main screen
*/
const App = () =>  {
  const res1 = useState(0);
  const res2 = useState(0);
  const res3 = useState(0);


  return (
    <div className="App">
      <div className="topBar">
        <div>Overview</div>
        <div>Planet</div>
        <div>Buildings</div>
        <div>Forces</div>
        <div>Map</div>
      </div>
        <div>Res 1: {res1}</div>
        <div>Res 2: {res2}</div>
        <div>Res 3: {res3}</div>
      <div className="starmapContainer">
        <img className="starmap" src={starmap} alt=""></img>
      </div>
    </div>
  );
}

export default App;
