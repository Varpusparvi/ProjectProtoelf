import React from 'react';
import image from './building_placeholder.png'

/*
* Container where context specific items are shown
*/
const Buildings = () =>  {

  var resGen1 = {
    id: 1,
    name: "Resource 1 generator",
    level: 1,
    priceResource1: 1,
    priceResource2: 3,
    priceResource3: 18
  }

  var resGen2 = {
    id: 2,
    name: "Resource 2 generator",
    level: 1,
    priceResource1: 1,
    priceResource2: 3,
    priceResource3: 18
  }

  var resGen3 = {
    id: 3,
    name: "Resource 3 generator",
    level: 1,
    priceResource1: 1,
    priceResource2: 3,
    priceResource3: 18
  }

  var starport = {
    id: 4,
    name: "Starport",
    level: 1,
    priceResource1: 1,
    priceResource2: 3,
    priceResource3: 18
  }

  var barracks = {
    id: 5,
    name: "Barracks",
    level: 1,
    priceResource1: 1,
    priceResource2: 3,
    priceResource3: 18
  }

  var tradingPost = {
    id: 6,
    name: "Trading post",
    level: 1,
    priceResource1: 1,
    priceResource2: 3,
    priceResource3: 18
  }

  const BUILDINGS = [
    resGen1,
    resGen2,
    resGen3,
    starport,
    barracks,
    tradingPost
  ]

  const handleClick = (id) => {
    console.log(id);
  }

  return (
    <div className="buildingGrid">
      {BUILDINGS.map((building) => {
        return (
          <div key={building.id} value={building.id} className="building" onClick={() => handleClick(building.id)}>
            <div className="building_img">
              <img src={image} alt=""></img>
              <div className="price">
                <div>Res1: {building.priceResource1}</div>
                <div>Res2: {building.priceResource2}</div>
                <div>Res3: {building.priceResource3}</div>
              </div>
            </div>
            <div>{building.name}</div>
          </div>
        )
      })}
    </div>
  );
}

export default Buildings;
