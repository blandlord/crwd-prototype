import React, {Component} from 'react'

import userDataHelpers from '../utils/userDataHelpers';

import * as registryActions from '../actions/registryActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../css/NotaryUserData.css'

class NotaryUserData extends Component {

  onVerifyClick(e, userAddress, stateText) {
    e.preventDefault();
    this.setUserDataState(userAddress, stateText);
  }

  setUserDataState(userAddress, stateText) {
    let state = userDataHelpers.getEntryStateInt(stateText);
    this.props.registryActions.setState({userAddress: userAddress, state: state});
  }

  render() {
    let userData = this.props.userData;
    let userDataStateText = userDataHelpers.getEntryStateText(userData.state);
    let registryStore = this.props.registryStore;

    return (
      <li className="list-group-item">
        <h4>SSN: {userData.ssn}&nbsp;
        <span className={`label label-${ userDataHelpers.getEntryLabel(userData.state) }`}>
          {userDataStateText}
        </span></h4>
        <span>{userData.userAddress}</span>

        {userDataStateText === "NEW" ?
          <div>
            <a href={"##"} className="btn btn-success btn-xs notary-verify-button"
               onClick={(e) => this.onVerifyClick(e, userData.userAddress, "VERIFIED")}
               disabled={registryStore.get('settingState')}>
              Verify
            </a>
            <a href={"##"} className="btn btn-danger btn-xs notary-verify-button"
               onClick={(e) => this.onVerifyClick(e, userData.userAddress, "DENIED")}
               disabled={registryStore.get('settingState')}>
              Deny
            </a>
          </div>
          :
          null
        }

        {userDataStateText === "VERIFIED" ?
          <div>
            <a href={"##"} className="btn btn-warning btn-xs notary-verify-button"
               onClick={(e) => this.onVerifyClick(e, userData.userAddress, "EXPIRED")}
               disabled={registryStore.get('settingState')}>
              Expire
            </a>
            <a href={"##"} className="btn btn-danger btn-xs notary-verify-button"
               onClick={(e) => this.onVerifyClick(e, userData.userAddress, "DENIED")}
               disabled={registryStore.get('settingState')}>
              Deny
            </a>
          </div>
          :
          null
        }

        {userDataStateText === "EXPIRED" ?
          <div>
            <a href={"##"} className="btn btn-primary btn-xs notary-verify-button"
               onClick={(e) => this.onVerifyClick(e, userData.userAddress, "VERIFIED")}
               disabled={registryStore.get('settingState')}>
              Verify
            </a>
          </div>
          :
          null
        }

      </li>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    registryStore: state.registryStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registryActions: bindActionCreators(registryActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotaryUserData);