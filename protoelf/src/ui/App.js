import React from 'react';
import {useState, useEffect, useRef} from 'react';
import MainContainer from './MainContainer';
import * as ResourceMining from '../modules/resource_mining.js';

var serverUrl = 'http://localhost:8080/';


/*
* Protoelf main screen
*/
const App = () =>  {
  const [user, setUser] = useState({
    _id : undefined,
    username: "",
  });
  const [currentColony, setCurrentColony] = useState({
    _id : 1,
    resource1: 0,
    resource2: 0,
    resource3: 0,
  });
  const [viewMode, setViewMode] = useState(2);
  const [buildings, setBuildings] = useState();
  const [res1, setRes1] = useState();
  const [res2, setRes2] = useState();
  const [res3, setRes3] = useState();
  const [res1Rate, setRes1Rate] = useState();
  const [res2Rate, setRes2Rate] = useState();
  const [res3Rate, setRes3Rate] = useState();

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
   * Sets values for the resources
   * @param {*} json colony info
   */
  const setResources = (json) => {
    let buildingIndex0 = Object.keys(json.buildings)[0];
    let buildingIndex1 = Object.keys(json.buildings)[1];
    let buildingIndex2 = Object.keys(json.buildings)[2];
    let _res1Rate = ResourceMining.getResourceRate(1,json.buildings[buildingIndex0]);  //
    let _res2Rate = ResourceMining.getResourceRate(2,json.buildings[buildingIndex1]);
    let _res3Rate = ResourceMining.getResourceRate(3,json.buildings[buildingIndex2]);
    setRes1(json.resource1);
    setRes2(json.resource2);
    setRes3(json.resource3);
    setRes1Rate(_res1Rate);
    setRes2Rate(_res2Rate);
    setRes3Rate(_res3Rate);
  }


  /**
   * Handles login and registering
   * @param {*} e value of input field
   */
  const loginHandler = async (e) => {
    if (e.keyCode === 13) {
      var username = e.target.value;

      let json = await createOrFetchPlayer(username);
      console.log(json[1].buildings);
      if (json === null || json === undefined) {
        return;
      }

      // init app
      setUser(json[0]);
      setCurrentColony(json[1]);
      setResources(json[1]);
      setBuildings(json[2]);
    }
  }


  /*
  * Function for fetching player data from the server
  */
  const createOrFetchPlayer = (username) => new Promise((resolve, reject) => {
    fetch(serverUrl + "login", {
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
        resolve(json);
        return json;
      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log(error);
    })
  })


  /**
   * Upgrades a building or tech with given id
   * @param {*} id id of an object to be upgraded
   */
  const upgrade = async (id) => {
    let array = Object.keys(currentColony.buildings);
    let upgradeToLevel;
    console.log(currentColony.buildings);

    for (let i of array) {
      if (id === i) {
        upgradeToLevel = currentColony.buildings[i] + 1;
        console.log("ous");
      }
    }

    
    console.log("APua: " + upgradeToLevel);
    // Send HTTP request
    await fetch(serverUrl + "building", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username,
        upgradeId: id,
        upgradeLevel: upgradeToLevel, // TODO
        colonyId: currentColony._id,
      })
    })
    .then((response) => {
      response.json().then((json) => {
        if (json === null) {
          return;
        }
        console.log(json);
        setCurrentColony(json);
        setResources(json);
        // TODO
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
        <MainContainer viewMode={viewMode} upgrade={upgrade} 
            buildings={buildings} currentColony={currentColony.buildings}></MainContainer>
    </div>
  );
}

export default App;
