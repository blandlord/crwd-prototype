import _ from 'lodash';

const orderTypeTexts = {
  0: "BUY",
  1: "SELL",
};

const orderTypeInts = _.invert(orderTypeTexts);

function getOrderTypeText(orderDataInt) {
  return orderTypeTexts[orderDataInt];
}

function getOrderTypeInt(orderTypeText) {
  return orderTypeInts[orderTypeText];
}

let orderDataHelpers = {
  getOrderTypeText,
  getOrderTypeInt
};

export default orderDataHelpers;