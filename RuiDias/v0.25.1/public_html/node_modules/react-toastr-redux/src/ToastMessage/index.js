"use strict";
var React = require("react/addons");
var {PropTypes} = React;
var {update} = React.addons;
var constants = require('../Constants');

function noop () {}

var ToastMessageSpec = {
  displayName: "ToastMessage",

  propTypes: {
    type: PropTypes.oneOf(Object.keys(constants.toastTypes)).isRequired,
    iconClassName: PropTypes.string,
    messageClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    tapToDismiss: PropTypes.bool,
    closeButton: PropTypes.bool
  },

  getDefaultProps () {
    return {
      titleClassName: "toast-title",
      messageClassName: "toast-message",
      tapToDismiss: true,
      closeButton: false
    };
  },

  handleOnClick (event) {
    var {props} = this;
    props.handleOnClick(event);
    if (props.tapToDismiss) {
      this.hideToast(true);
    }
  },

  _handle_close_button_click (event) {
    event.stopPropagation();
    this.hideToast(true);
  },

  _handle_remove () {
    var {props} = this;
    props.handleRemove(props.toastId);
  },

  _render_close_button (props) {
    return props.closeButton ? (
      <button className="toast-close-button" role="button"
              onClick={this._handle_close_button_click}>&times;</button>
    ) : false;
  },

  _render_title_element (props) {
    return props.title ? (
      <div className={props.titleClassName}>
        {props.title}
      </div>
    ) : false;
  },

  _render_message_element (props) {
    return props.message ? (
      <div className={props.messageClassName}>
        {props.message}
      </div>
    ) : false;
  },

  render () {
    var cx = React.addons.classSet;
    var {props} = this;
    var iconClassName = props.iconClassName || constants.iconClassNames[props.type];

    var toastClass = {
      "toast": true
    };

    if (props.className) {
      toastClass[props.className] = true;
    }

    toastClass[iconClassName] = true;

    return (
      <div className={cx(toastClass)} style={props.style || {}}
            onClick={this.handleOnClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}>
        {this._render_close_button(props)}
        {this._render_title_element(props)}
        {this._render_message_element(props)}
      </div>
    );
  }
};


var animation = React.createClass(update(ToastMessageSpec, {
  displayName: { $set: "ToastMessage.animation" },
  mixins: { $set: [require("./animationMixin")] }
}));

var jQuery = React.createClass(update(ToastMessageSpec, {
  displayName: { $set: "ToastMessage.jQuery" },
  mixins: { $set: [require("./jQueryMixin")] }
}));

/*
 * assign default noop functions
 */
ToastMessageSpec.handleMouseEnter = noop;
ToastMessageSpec.handleMouseLeave = noop;
ToastMessageSpec.hideToast = noop;

var ToastMessage = module.exports = React.createClass(ToastMessageSpec);
ToastMessage.animation = animation;
ToastMessage.jQuery = jQuery;
