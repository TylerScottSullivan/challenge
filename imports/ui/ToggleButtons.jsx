import React from 'react';

const ToggleButtons = (props) => {
	return ((props.address) ?  
            <div className="toggle" onClick={props.toggleButton.bind(this)}>
              <button> Address </button>
              <button id="inactive"> Coordinates </button>
            </div>
          :
            <div className="toggle" onClick={props.toggleButton.bind(this)}>
              <button id="inactive"> Address </button>
              <button> Coordinates </button>
            </div>
   )
}

export default ToggleButtons;