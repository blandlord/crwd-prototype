import React, {Component} from 'react'

import userDataHelpers from '../utils/userDataHelpers';

import {connect} from 'react-redux'


class UserData extends Component {


  render() {
    let userData = this.props.userData;

    return (
      <div>
        <span className={`label label-${ userDataHelpers.getEntryLabel(userData.state) }`}>
          {userDataHelpers.getEntryStateText(userData.state)}
        </span>
        {userData.userAddress}
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
)(UserData);