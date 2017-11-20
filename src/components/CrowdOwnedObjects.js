import React, {Component} from 'react'

const _ = require('lodash');

import * as crowdOwnedActions from '../actions/crowdOwnedActions';
import * as notificationActions from '../actions/notificationActions';

import CrowdOwnedContract from './CrowdOwnedContract';
import userDataHelpers from '../utils/userDataHelpers';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'



class CrowdOwnedObjects extends Component {

  filterCrowdOwnedContracts(crowdOwnedContracts) {
    let state = this.props.registryStore.get('currentUserData').state;
    let stateText = userDataHelpers.getEntryStateText(state);

    return _.filter(crowdOwnedContracts, (crowdOwnedContract) => {
      return stateText === "VERIFIED" || crowdOwnedContract.balance > 0;
    });
  }

  sortCrowdOwnedContracts(crowdOwnedContracts) {
    return _.orderBy(crowdOwnedContracts, ['balance', 'name'], ['desc', 'asc']);
  }

  render() {
    let {crowdOwnedStore} = this.props;
    let crowdOwnedContracts = this.filterCrowdOwnedContracts(this.sortCrowdOwnedContracts(crowdOwnedStore.get('crowdOwnedContracts')));

    return (
      <div>
        <h3>Crowd Owned objects ({crowdOwnedContracts.length})</h3>

        {crowdOwnedStore.get('loadingCrowdOwnedContracts') ?
          "Loading CrowdOwned Contracts..."
          :
          <div className="crowd-owned-contracts listing-block">
            {crowdOwnedContracts.length === 0 ? <em>The CrowdOwned Contracts list is empty.</em> : null}
            {crowdOwnedContracts.map((crowdOwnedContract) => (
              <CrowdOwnedContract crowdOwnedContract={crowdOwnedContract}
                                  key={crowdOwnedContract.address}/>
            ))}
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    registryStore: state.registryStore,
    crowdOwnedStore: state.crowdOwnedStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    crowdOwnedActions: bindActionCreators(crowdOwnedActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CrowdOwnedObjects);