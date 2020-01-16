import React from 'react';


/*
* Container where context specific items are shown
*/
const MainContainer = ({viewMode}) =>  {

  if (viewMode === 0) {
    return (
      <div>Overview view</div>
  );
  } else if (viewMode === 1) {
    return (
        <div>Planet view</div>
    );
  } else if (viewMode === 2) {
    return (
        <div>Buildings view</div>
    );
  } else if (viewMode === 3) {
    return (
        <div>Force view</div>
    );
  } else {
    return (
        <div>Starmap view</div>
    );
  }
}

export default MainContainer;
