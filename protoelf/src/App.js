import React from 'react';
import {useState} from 'react';
import MainContainer from './MainContainer';

var serverUrl = 'http://localhost:8080/';

/*
* Protoelf main screen
*/
const App = () =>  {
  const [res1, setRes1] = useState(0);
  const [res2, setRes2] = useState(0);
  const [res3, setRes3] = useState(0);
  const [viewMode, setViewMode] = useState(0);

  /*
  const fetchData = async () => {
    await fetch(serverUrl).then((response) => {
      response.json().then((json) => {
        console.log(json);
      })
    })
  }
  */

  const fetchData = async () => {
    await fetch(serverUrl).then((response) => {
      response.json().then((json) => {
        console.log(json);
      })
    })
  }


  const changeModeOverview = (e) => {
    console.log(e.target.textContent);
    setViewMode(0);
    fetchData();
  }

  const changeModePlanet = (e) => {
    console.log(e.target.textContent);
    setViewMode(1);
    fetchData();
  }

  const changeModeBuildings = (e) => {
    console.log(e.target.textContent);
    setViewMode(2);
    fetchData();
  }

  const changeModeForces = (e) => {
    console.log(e.target.textContent);
    setViewMode(3);
    fetchData();
  }

  const changeModeStarmap = (e) => {
    console.log(e.target.textContent);
    setViewMode(4);
    fetchData();
  }

  return (
    <div className="App">
      <div className="topBar">
        <div className="button" onClick={changeModeOverview}>Overview</div>
        <div className="button" onClick={changeModePlanet}>Planet</div>
        <div className="button" onClick={changeModeBuildings}>Buildings</div>
        <div className="button" onClick={changeModeForces}>Forces</div>
        <div className="button" onClick={changeModeStarmap}>Starmap</div>
      </div>
        <div>Res 1: {res1}</div>
        <div>Res 2: {res2}</div>
        <div>Res 3: {res3}</div>
      <MainContainer viewMode={viewMode}></MainContainer>
    </div>
  );
}

export default App;
