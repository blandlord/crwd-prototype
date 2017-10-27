import React, {Component} from 'react'

import * as registryActions from '../actions/registryActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import NewAddressForm from './NewAddressForm';
import UserData from './UserData';

class Home extends Component {
  componentDidMount() {

  }

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    let {registryStore} = this.props;

    return (
      <div className="container">
        <div className="home">
          <div className="row">
            <div className="col-sm-6">
              <h1>CRWD</h1>
              <h2>Register your address</h2>
              <p>A notary service will verify your information.</p>
              <NewAddressForm/>
            </div>

            <div className="col-sm-6">
              <h3>Users Data</h3>
              {registryStore.get('loadingUsersData') ?
                "Loading Users Data..."
                :
                <ul className="entries">
                  {registryStore.get('usersData').length === 0 ? <em>The registry is empty.</em> : null}
                  {registryStore.get('usersData').map((userData) => (
                    <UserData userData={userData} key={userData.userAddress}/>
                  ))}
                </ul>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    registryStore: state.registryStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registryActions: bindActionCreators(registryActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);