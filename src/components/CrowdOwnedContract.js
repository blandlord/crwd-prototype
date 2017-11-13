import React, {Component} from 'react'

import {connect} from 'react-redux'

import {NavLink} from "react-router-dom";


class CrowdOwnedContract extends Component {

  render() {
    let crowdOwnedContract = this.props.crowdOwnedContract;

    return (
      <div className="media">
        <img className="img-responsive" src={crowdOwnedContract.imageUrl} role="presentation"/>
        <div className="media-body">
          <div className="price">
            <NavLink exact to={"/crowd-owned/" + crowdOwnedContract.address}>{crowdOwnedContract.name}</NavLink>
            <small>{crowdOwnedContract.symbol}</small>
          </div>
        </div>
      </div>
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