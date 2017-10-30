const _ = require('lodash');

const stateTexts = {
  0: "NEW",
  1: "VERIFIED",
  2: "EXPIRED",
  3: "DENIED",
};

const stateInts = _.invert(stateTexts);

function getEntryLabel(userDataState) {
  let label;
  switch (userDataState) {
    case 0:
      label = "info";
      break;
    case 1:
      label = "success";
      break;
    case 2:
      label = "danger";
      break;
    case 3:
      label = "danger";
      break;
    default:
      label = "warning";
  }
  return label;
}

function getEntryStateText(userDataStateInt) {
  return stateTexts[userDataStateInt];
}

function getEntryStateInt(userDataStateText) {
  return stateInts[userDataStateText];
}

let userDataHelpers = {
  getEntryLabel: getEntryLabel,
  getEntryStateText: getEntryStateText,
  getEntryStateInt: getEntryStateInt,
};

export default userDataHelpers;