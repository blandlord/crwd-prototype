import React, {Component} from 'react'

import {connect} from 'react-redux'

class CrowdOwnedContract extends Component {


  render() {
    let crowdOwnedContract = this.props.crowdOwnedContract;

    return (
      <li>
        {crowdOwnedContract.name}
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