import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import * as web3Actions from "../actions/web3Actions";
import * as notificationActions from "../actions/notificationActions";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Notifications from "react-notification-system-redux";

class Navbar extends Component {
  componentDidMount() {
    this.props.web3Actions.initWeb3();

    this.props.notificationActions.success({
      notification: {
        message: "Welcome to CRWD",
        position: "br"
      }
    });
  }

  render() {
    let { web3Store } = this.props;
    let web3 = web3Store.get("web3");
    let networkName = web3Store.get("networkName");

    return (
      <nav className="navbar navbar-default">
        <Notifications notifications={this.props.notifications} />
        <div className="navbar-header">
          <a className="navbar-brand" href="##">
            <img
              src="https://www.blandlord.com/static/img/blandlord-color.png"
              width="15.5"
              height="25"
              class="d-inline-block align-top"
              alt="logo"
            />
          </a>
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li>
              <NavLink exact to="/">
                Investor
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/notary">
                Notary
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/admin">
                Admin
              </NavLink>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="##" className="dropdown-toggle" data-toggle="dropdown">
                <b>Network:</b> {networkName}
              </a>
            </li>

            <li className="dropdown">
              <a href="##" className="dropdown-toggle" data-toggle="dropdown">
                <b>Account:</b> {web3 ? web3.eth.defaultAccount : null}
              </a>
            </li>
          </ul>
        </div>
        {/*/.nav-collapse */}
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    web3Store: state.web3Store,
    notifications: state.notifications
  };
};

const mapDispatchToProps = dispatch => {
  return {
    web3Actions: bindActionCreators(web3Actions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
