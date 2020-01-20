import React from 'react';
import {useState, useEffect, useRef} from 'react';
import MainContainer from './MainContainer';
import * as ResourceMining from '../modules/resource_mining.js';

var serverUrl = 'http://localhost:8080/';


/*
* Protoelf main screen
*/
const App = () =>  {
  const [viewMode, setViewMode] = useState(2);
  const [res1, setRes1] = useState(0);
  const [res2, setRes2] = useState(0);
  const [res3, setRes3] = useState(0);
  const [res1Rate, setRes1Rate] = useState(1);
  const [res2Rate, setRes2Rate] = useState(3);
  const [res3Rate, setRes3Rate] = useState(18);
  const [user, setUser] = useState({
    _id : undefined,
    username: "",
  });
  const [currentColony, setCurrentColony] = useState({
    _id : 1,
    resource1: 0,
    resource2: 0,
    resource3: 0,
    resource1Level: 0,
    resource2Level: 0,
    resource3Level: 0,
  });

  // Resource meter updater
  useInterval(() => {
    setRes1(res1 + res1Rate);
    setRes2(res2 + res2Rate);
    setRes3(res3 + res3Rate);
  },1000)


  const changeModeOverview = (e) => {
    console.log(e.target.textContent);
    setViewMode(0);
  }

  const changeModePlanet = (e) => {
    console.log(e.target.textContent);
    setViewMode(1);
  }

  const changeModeBuildings = (e) => {
    console.log(e.target.textContent);
    setViewMode(2);
  }

  const changeModeForces = (e) => {
    console.log(e.target.textContent);
    setViewMode(3);
  }

  const changeModeStarmap = (e) => {
    console.log(e.target.textContent);
    setViewMode(4);
  }


  /**
   * Handles login and registering
   * @param {*} e value of input field
   */
  const loginHandler = (e) => {
    if (e.keyCode === 13) {
      var username = e.target.value;
      createOrFetchPlayer(username);
    }
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
        if (json === null) {
          return;
        }
        console.log(json);
        setUser(json[0]);
        // Tähän systeemi jolla saahaan res1,2,3 arvot asetettua
        var _res1 = json[1].resource1;
        var _res2 = json[1].resource2;
        var _res3 = json[1].resource3;
        var _res1Rate = ResourceMining.getResourceRate(1,json[1].resource1Level);
        var _res2Rate = ResourceMining.getResourceRate(2,json[1].resource2Level);
        var _res3Rate = ResourceMining.getResourceRate(3,json[1].resource3Level);
        setRes1(_res1);
        setRes2(_res2);
        setRes3(_res3);
        setRes1Rate(_res1Rate);
        setRes2Rate(_res2Rate);
        setRes3Rate(_res3Rate);
        
        setUser(json[0]);
        setCurrentColony(json[1]);
      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log(error);
    })
  }


  /**
   * Upgrades a building or tech with given id
   * @param {*} id id of an object to be upgraded
   */
  const upgrade = async (id) => {
    await fetch(serverUrl + "upgrade", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username,
        upgradeId: id,
        upgradeLevel: 2,
        colonyId: currentColony._id,
      })
    })
    .then((response) => {
      response.json().then((json) => {
        if (json === null) {
          return;
        }
        console.log(json);
        // TODO
        var _res1 = json.resource1;
        var _res2 = json.resource2;
        var _res3 = json.resource3;
        var _res1Rate = ResourceMining.getResourceRate(1,json.resource1Level);
        var _res2Rate = ResourceMining.getResourceRate(2,json.resource2Level);
        var _res3Rate = ResourceMining.getResourceRate(3,json.resource3Level);
        setRes1(_res1);
        setRes2(_res2);
        setRes3(_res3);
        setRes1Rate(_res1Rate);
        setRes2Rate(_res2Rate);
        setRes3Rate(_res3Rate);

      })
    }).catch((error) => {
      console.log(error)
    })
  }


  /**
   * Define "useInterval" function that is functionally the same as "setInterval()
   * @param {*} callback function to be executed
   * @param {*} delay time between executions in ms
   */
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
        <MainContainer viewMode={viewMode} upgrade={upgrade}></MainContainer>
    </div>
  );
}

export default App;
