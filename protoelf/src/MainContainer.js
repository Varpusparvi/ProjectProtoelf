import React from 'react';
import starmap from './starmap.png';

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
      <div className="starmapContainer">
        <div>{res1}</div>
        <div>{res2}</div>
        <div>{res3}</div>
        <img className="starmap" src={starmap} alt=""></img>
      </div>
    </div>
  );
}

export default App;
