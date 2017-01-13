import React, { Component, PropTypes } from 'react';

export default class AddressFields extends Component {

  componentDidMount() {
    let input = document.getElementById('address-input');
    new google.maps.places.Autocomplete(input, {types: ['geocode']});
  }

  render() {
    return  <div className="input">
                <label> Address: </label>
                <input id="address-input"/>  
                <div className="error"> {this.props.errors.address} </div> 
            </div>   
  }
}


