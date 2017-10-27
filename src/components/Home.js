import React, {Component} from 'react'


import * as registryActions from '../actions/registryActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../css/Home.css'

class Home extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <div className="container">
        <div className="home">

        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    registryActions: bindActionCreators(registryActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);