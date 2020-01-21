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
      if (building._id === field) {
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
        console.log("render")
        return (
          <div key={building._id} value={building._id} className="building" onClick={() => handleClick(building._id)}>
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
