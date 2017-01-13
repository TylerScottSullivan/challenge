import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' 

//mongo collection
import { Addresses } from '../api/addresses.js';
 
// other react component
import ToggleButtons from './ToggleButtons.jsx';
import AddressFields from './AddressFields.jsx';
import LatLongFields from './LatLongFields.jsx';
import LocationsList from './LocationsList.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: true,
      maxDistance: null,
      locations: [],
      submitted: false,
      lat: null,
      lng: null,
      errors: {}
    };
  }

  // controls displaying coordinate input or address input
  toggleButton() {
    let newinput = !this.state.address;
    this.setState({
      address: newinput,
      lat: null,
      lng: null
    })
  }

  // updates max distance input
  changeMaxDistance(e) {
    let newDist = e.target.value;
    this.setState({
      maxDistance: newDist,
      submitted: false
    })
  }

  // updates latitude input
  changeLat(newLat) {
    this.setState({
      lat: newLat
    })
  }

  // updates longitude input
  changeLong(newLong) {
    this.setState({
      lng: newLong
    })
  }

  // validates forms, rendering error messages
  validate() {

    this.setState({
      errors: {}
    })

    let errors = {};

    if (!this.state.maxDistance) {
      errors.maxDistance = "Distance is required."
    } 

    if (this.state.address) {
      if (!document.getElementById("address-input").value) {
        errors.address = "Address is required."
      }
    } else {
      if (!this.state.lat) {
        errors.lat = "Latitude is required."
      }

      if (this.state.lat > 90 || this.state.lat < -90) {
        errors.lat = "Latitude must be beween -90 and 90 degrees."
      }

      if (!this.state.lng) {
        errors.lng = "Longitude is required."
      } 

      if (this.state.lng > 180 || this.state.lng < -180) {
        errors.lng = "Longitude must be between -180 and 180 degrees."
      }
    }

    if (Object.keys(errors).length) {
      this.setState({
        errors: errors
      })
    } else {
      this.setState({
        errors: {}
      })
      this._buttonClick();
    }
  }

  // gets list of locations within max distance, sets state
  _buttonClick() {

    // if address input displayed, calls google geoccode api, gets longitude and latitude of address
    if (this.state.address) {

      let location=document.getElementById("address-input").value;
      let stringLocation= location.split(' ').join('+');

      fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + stringLocation + "&key=" + GOOGLE_KEY_HERE)
      .then((response) => response.json())
      .then(response => {

        let latitude = response.results[0].geometry.location.lat;
        let longitude = response.results[0].geometry.location.lng;
        return this._findResults(latitude, longitude)

      }).then(response => {
        this.setState({
          locations: response,
          submitted: true
        })
      })

    } else {
      let response = this._findResults(this.state.lat, this.state.lng)
      this.setState({
        locations: response,
        submitted: true
      })
    } 
  }

  // calculates distance from user input location and database locations, returns locations witihin max distance
  _findResults(latitude, longitude) {
    let mylat = this._dToRad(latitude)
    let mylong = this._dToRad(longitude)
    let addresses = this.props.addresses;
    let earthRadius = 3959;
    let results = [];

    addresses.forEach((address) => {
      let adlat = this._dToRad(address.latitude)
      let adlong = this._dToRad(address.longitude)
      let angle = Math.acos(Math.sin(mylat) * Math.sin(adlat) + Math.cos(mylat) * Math.cos(adlat) * Math.cos(Math.abs(mylong-adlong)));
      let distance = earthRadius * angle;
      address.distance = Math.ceil(distance);

      if (address.distance <= this.state.maxDistance) {
        results.push(address);
      }
    });

    results.sort((a, b) => a.distance-b.distance)

    return results;
  }

  // converts degrees to radians
  _dToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  render() {
    return (
      <div className="page">
        <div className="title"> Proximity Lookup</div>
        <div className="description"> Please use this form to enter a location and max distance. Locations within this distance will be listed below.</div>

        <ToggleButtons address={this.state.address} toggleButton={this.toggleButton.bind(this)}/>

        <div className="inputs-container">
          <div className="transition-container">
            <ReactCSSTransitionGroup
              transitionName="inputs-transition"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={1}>
              {this.state.address ? <AddressFields errors={this.state.errors}/> : null}
            </ReactCSSTransitionGroup>
            <ReactCSSTransitionGroup
              transitionName="inputs-transition-num2"
              transitionEnterTimeout={900}
              transitionLeaveTimeout={1}>
              {this.state.address ? null : <LatLongFields latitude={this.state.latitude} longitude={this.state.lng} changeLat={this.changeLat.bind(this)} changeLong={this.changeLong.bind(this)} errors={this.state.errors}/>}
            </ReactCSSTransitionGroup>
          </div>

          <div className="input" id="distance-input">
            <label> Distance: </label>
            <input placeholder="Miles" onChange={this.changeMaxDistance.bind(this)} value={this.state.maxDistance}/>
            <div className="error"> {this.state.errors.maxDistance} </div>
          </div>

        </div>

        <button className="submit" onClick = {this.validate.bind(this)}> Submit </button>

        <LocationsList submitted={this.state.submitted} locations={this.state.locations} maxDistance={this.state.maxDistance}/>
      </div>
    );
  }
}

// gets tasks from db and puts them into App as props
export default createContainer(() => {
  return {
    addresses: Addresses.find({}).fetch(),
  };
}, App);
