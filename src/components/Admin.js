import React, {Component} from 'react'

import * as registryActions from '../actions/registryActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import NewNotaryForm from './NewNotaryForm';

class Admin extends Component {
  componentDidMount() {
  }

  render() {
    let {registryStore, web3Store} = this.props;

    if (!web3Store.get("web3")) {
      return null;
    }

    return (
      <div className="container">
        <div className="home">
          {registryStore.get('loadingOwnerAddress') ?
            "Loading permissions ..."
            :
            registryStore.get('ownerAddress') !== web3Store.get("web3").eth.defaultAccount ?
              "Not Authorized ..."
              :
              <div className="row">
                <div className="col-sm-12">
                  <h1>Admin page</h1>
                  <h3>Add Notary</h3>
                  <NewNotaryForm/>

                  <h3>Notaries Data</h3>
                  {registryStore.get('loadingNotariesData') ?
                    "Loading Notaries Data..."
                    :
                    <ul className="notaries list-group">
                      {registryStore.get('notariesData').length === 0 ? <em>The notaries registry is empty.</em> : null}
                      {registryStore.get('notariesData').map((notaryData) => (
                        <li key={notaryData.address}>
                          <b>Address:</b> {notaryData.address} <br/>
                          <b>Name:</b> {notaryData.name} <br/>
                          <b>Website URL:</b> {notaryData.websiteUrl}
                        </li>
                      ))}
                    </ul>
                  }
                </div>
              </div>
          }
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
)(Admin);