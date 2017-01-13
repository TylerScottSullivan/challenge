import React, { Component, PropTypes } from 'react';

export default class LatLongFields extends Component {

  onLatChange(e) {
    let newLat=e.target.value;
    console.log(newLat)
    this.props.changeLat(newLat);
  }

  onLongChange(e) {
    let newLong=e.target.value;
    console.log(newLong);
    this.props.changeLong(newLong);
  }

  render() {
    return  (
            <div className="latlong-container">
              <div className="input">
                <label> Latitude: </label>
                <input placeholder="Decimal Degrees" value={this.props.latitude} onChange={this.onLatChange.bind(this)}/>
                <div className="error"> {this.props.errors.lat} </div>
              </div>
              <div className="input">
                <label> Longitude: </label>
                <input placeholder="Decimal Degrees" value={this.props.longitude} onChange={this.onLongChange.bind(this)}/>
                <div className="error"> {this.props.errors.lng} </div>
              </div>
            </div> 
            )
  }
}
