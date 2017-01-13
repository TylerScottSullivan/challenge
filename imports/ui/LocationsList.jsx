import React from 'react';

const LocationsList = (props) => {
  if (props.locations.length) {
    return (
          <div className="locations">
            <div className="list-title">Locations Found</div>
            <ol>
              {props.locations.map((location, key) => 
                <li key={key}> <p> {location.street_number} {location.route}, {location.locality}, {location.administrativeArea}, {location.country} {location.postalCode} </p> ( {location.distance} miles away) </li>)
              }

            </ol>
          </div>
          )
  } else if (props.submitted) {
    return (
          <div className="locations">
            <div className="list-title"> 0 Locations Found Within {props.maxDistance} Miles </div>
          </div>
          )
  } else {
    return <div> </div>
  }
}

export default LocationsList;