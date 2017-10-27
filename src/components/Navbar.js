import React, {Component} from 'react'

import * as actions from '../actions/web3Actions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class Navbar extends Component {

  componentDidMount() {
    this.props.actions.initWeb3();
  }

  render() {
    let {web3Store} = this.props;
    let web3 = web3Store.get("web3");
    let networkName = web3Store.get("networkName");

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                    aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <a className="navbar-brand" href="#">Registry</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li><a href="#">About</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <b>Network:</b> {networkName}
                </a>
              </li>

              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <b>Account:</b>  {web3 ? web3.eth.defaultAccount : null}
                </a>
              </li>
            </ul>
          </div>
          {/*/.nav-collapse */}
        </div>
        {/*/.container-fluid */}
      </nav>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);