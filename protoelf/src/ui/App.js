import React from 'react';
import {useState, useEffect, useRef} from 'react';
import MainContainer from './MainContainer';
import * as ResourceMining from '../modules/Resource_mining.js';

var serverUrl = 'http://localhost:8080/';


/*
* Protoelf main screen
*/
const App = () =>  {
  const [viewMode, setViewMode] = useState(0);
  const [res1, setRes1] = useState(0);
  const [res2, setRes2] = useState(0);
  const [res3, setRes3] = useState(0);
  const [res1Rate, setRes1Rate] = useState(1);
  const [res2Rate, setRes2Rate] = useState(3);
  const [res3Rate, setRes3Rate] = useState(18);
  const [user, setUser] = useState();
  const [currentColony, setCurrentColony] = useState();


  useInterval(() => {
    setRes1(res1 + res1Rate);
    setRes2(res2 + res2Rate);
    setRes3(res3 + res3Rate);
  },1000)


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

  const loginHandler = async (e) => {
    if (e.keyCode === 13) {
      var username = e.target.value;
      await createOrFetchPlayer(username);
    }
  }

  /*
  * Basic get without data
  */
  const fetchData = async () => {
    await fetch(serverUrl).then((response) => {
      response.json().then((json) => {
        console.log(json);
      })
    }).catch((e) => {
      console.log(e);
    })
  }

  /*
  * Function for fetching player data from the server
  */
  const createOrFetchPlayer = async (username) => {
    await fetch(serverUrl + "login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    })
    .then((response) => {
      response.json().then((json) => {
        setUser(json);
        // Tähän systeemi jolla saahaan res1,2,3 arvot asetettua
        var _res1 = json[1].res1;
        var _res2 = json[1].res2;
        var _res3 = json[1].res3;
        var _res1Rate = ResourceMining.getResourceRate(1,json[1].res1Lvl);
        var _res2Rate = ResourceMining.getResourceRate(2,json[1].res2Lvl);
        var _res3Rate = ResourceMining.getResourceRate(3,json[1].res3Lvl);
        setRes1(_res1);
        setRes2(_res2);
        setRes3(_res3);
        setRes1Rate(_res1Rate);
        setRes2Rate(_res2Rate);
        setRes3Rate(_res3Rate);
        setUser(json[0]);

        console.log(json);
      })
    }).catch((e) => {
      console.log(e);
    })
  }

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  return (
    <div className="App">
      <div className="topBar">
        <div className="button" onClick={changeModeOverview}>Overview</div>
        <div className="button" onClick={changeModePlanet}>Planet</div>
        <div className="button" onClick={changeModeBuildings}>Buildings</div>
        <div className="button" onClick={changeModeForces}>Forces</div>
        <div className="button" onClick={changeModeStarmap}>Starmap</div>
        <input placeholder="Enter username" onKeyUp={loginHandler}></input>
      </div>
        <div>Res 1: {res1}</div>
        <div>Res 2: {res2}</div>
        <div>Res 3: {res3}</div>
      <MainContainer viewMode={viewMode}></MainContainer>
    </div>
  );
}

export default App;
