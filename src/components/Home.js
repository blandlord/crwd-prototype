import React, {Component} from 'react'

const _ = require('lodash');

import userDataHelpers from '../utils/userDataHelpers';

import * as registryActions from '../actions/registryActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import NewAddressForm from './NewAddressForm';
import UserData from './UserData';
import CrowdOwnedObjects from './CrowdOwnedObjects';


class Home extends Component {
  componentDidMount() {
  }


  render() {
    let {registryStore, web3Store} = this.props;
    let web3 = web3Store.get("web3");
    let loadingWeb3 = web3Store.get("loadingWeb3");
    let currentUserData = registryStore.get('currentUserData');
    let ownAddress = _.get(web3, 'eth.defaultAccount');
    let registryOwnerAddress = registryStore.get('ownerAddress');

    return (
      <div>
        <div className="home-header">
          <div className="jumbotron">
            <div className="container">
              <h1>The future is crowd owned</h1>
              <p>Work together, create value.</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="home">
            {registryStore.get('loadingUsersData') ?
              "Loading Users Data..."
              :
              <div>
                <div className="row">
                  <div className="col-sm-6 col-md-7">
                    <h2>Welcome</h2>
                    <p>In Crowd city you will find like minded people. Together you can own real-world property,
                      like an apartment or solar panels. You can start your own project, or choose to join an existing
                      group.</p>
                    <p>This community is about investing together with a social motivation. Yes, you will generate
                      return on investment. But the results will be at least as socially rewarding as financially.</p>

                    <h3>How does it work</h3>
                    <p>If you want to start your own community project, please visit one of the notary services
                      listed in our notary section.</p>
                    <p>If you want to join an existing project, please activate your blockchain account and the
                      City will open up for you.</p>

                    {(registryOwnerAddress === ownAddress || currentUserData.isNotary || userDataHelpers.getEntryStateText(currentUserData.state) !== "NEW") ?
                      <CrowdOwnedObjects/>
                      : null
                    }
                  </div>
                  <div className="col-sm-6 col-md-5 col-lg-4">
                    {loadingWeb3 ? "Loading web3 ..." :
                      web3 && ownAddress ?
                        <div className="well well-sm">
                          {currentUserData.isUserData ?
                            <div>
                              <h3>Your application status</h3>

                              <UserData userData={currentUserData}/>

                            </div>
                            :
                            <div>
                              <h3>Register your address</h3>
                              <p>A notary service will verify your information.</p>
                              <NewAddressForm/>
                            </div>
                          }
                        </div>
                        :
                        <div className="well well-sm">
                          <h3>Please enable web3</h3>
                          <p>To participate in Crowd City, you need to connect to our public blockchain.
                            The easiest way is to install the Metamask plugin.</p>
                          <p>Please refer to our documentation.</p>
                        </div>
                    }
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    registryStore: state.registryStore
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