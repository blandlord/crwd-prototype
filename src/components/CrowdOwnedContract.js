import React, {Component} from 'react'

import {connect} from 'react-redux'

import {NavLink} from "react-router-dom";


class CrowdOwnedContract extends Component {

  render() {
    let crowdOwnedContract = this.props.crowdOwnedContract;

    return (
      <li>
        <NavLink exact to={"/crowd-owned/" + crowdOwnedContract.address}> {crowdOwnedContract.name}</NavLink>
      </li>
    );
  }
}


const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CrowdOwnedContract);