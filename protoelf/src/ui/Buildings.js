import React from 'react';
import image from './building_placeholder.png'

/*
* Container where context specific items are shown
*/
const Buildings = ({upgrade, buildings, currentColony}) =>  {

  const handleClick = (buildingId) => {
    upgrade(buildingId);
  }

  const combineData = (building) => {
    let array = Object.keys(currentColony);
    for (let field of array) {
      if (building.name === field) {
        return currentColony[field];
      }
    }
  }

  if (buildings === undefined) {
    return (
      <div>No buildings found. This is probably caused by no access to the server</div>
    )
  }
  return (
    <div className="buildingGrid">
      {buildings.map((building) => {
        let level = combineData(building);
        return (
          <div key={building.name} value={building.name} className="building" onClick={() => handleClick(building.name)}>
            <div className="building_img">
              <img src={image} alt=""></img>
              <div className="price">
                <div>Res1: {building.priceResource1}</div>
                <div>Res2: {building.priceResource2}</div>
                <div>Res3: {building.priceResource3}</div>
              </div>
            </div>
            <div>{building.name}</div>
        <div>Level: {level}</div>
          </div>
        )
      })}
    </div>
  );
}

export default Buildings;
