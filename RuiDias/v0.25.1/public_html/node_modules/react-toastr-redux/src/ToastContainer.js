"use strict";
var React = require("react/addons");
var {PropTypes} = React;
var {update} = React.addons;
var {classSet} = React.addons;

var constants = require("./Constants");

var ToastMessage = React.createFactory(require("./ToastMessage"));

function noop () {}

module.exports = React.createClass({
  displayName: "ToastContainer",

  propTypes: {
    toastMessageFactory: PropTypes.func.isRequired,
    preventDuplicates: PropTypes.bool,
    onClick: PropTypes.func,
    toastPosition: PropTypes.shape({
      horizontal: PropTypes.oneOf(Object.keys(constants.toastHorizontalPositions)),
      vertical: PropTypes.oneOf(Object.keys(constants.toastVerticalPositions))
    }).isRequired
  },

  error (message, title, optionsOverride) {
    this._notify(constants.toastTypes.error, message, title, optionsOverride);
  },

  info (message, title, optionsOverride) {
    this._notify(constants.toastTypes.info, message, title, optionsOverride);
  },

  success (message, title, optionsOverride) {
    this._notify(constants.toastTypes.success, message, title, optionsOverride);
  },

  warning (message, title, optionsOverride) {
    this._notify(constants.toastTypes.warning, message, title, optionsOverride);
  },

  clear () {
    var {refs} = this,
        key;
    for (key in refs) {
      refs[key].hideToast(false);
    }
  },

  getDefaultProps () {
    return {
      toastMessageFactory: ToastMessage,
      preventDuplicates: false,
      newestOnTop: true,
      onClick: noop,
      toastPosition: {
        horizontal: constants.toastHorizontalPositions.right,
        vertical: constants.toastVerticalPositions.top
      }
    };
  },

  getInitialState () {
    return {
      toasts: [],
      toastId: 0,
      previousMessage: null
    };
  },

  render () {
    var vPos = this.props.toastPosition.vertical;
    var hPos = this.props.toastPosition.horizontal;
    var props = React.__spread(
      {className: "toast-container toast-" + vPos + '-' + hPos},
      this.props
    );

    return this._render(props, this.state);
  },

  _notify (type, message, title, optionsOverride) {
    var {props, state} = this;
    if (props.preventDuplicates) {
      if (state.previousMessage === message) {
        return;
      }
    }
    var key = state.toastId++;
    var toastId = key;
    var newToast = update(optionsOverride || {}, {
      $merge: {
        type,
        title,
        message,
        toastId,
        key,
        ref: `toasts__${ key }`,
        handleOnClick: this._handle_toast_on_click,
        handleRemove: this._handle_toast_remove
      }
    });
    var toastOperation = {};
    toastOperation[`${ props.newestOnTop ? "$unshift" : "$push" }`] = [newToast];

    var newState = update(state, {
      toasts: toastOperation,
      previousMessage: { $set: message }
    });
    this.setState(newState);
  },

  _handle_toast_on_click (event) {
    this.props.onClick(event);
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  },

  _handle_toast_remove (toastId) {
    var {state} = this;
    state.toasts[`${ this.props.newestOnTop ? "reduceRight" : "reduce" }`]((found, toast, index) => {
      if (found || toast.toastId !== toastId) {
        return false;
      }
      this.setState(update(state, {
        toasts: { $splice: [[index, 1]] }
      }));
      return true;
    }, false);
  },

  _render (props, state) {
    return <div {...props} aria-live="polite" role="alert">
      {state.toasts.map((toast) => {
        return props.toastMessageFactory(toast);
      })}
    </div>;
  }
});
