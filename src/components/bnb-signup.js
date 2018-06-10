import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import { getFullPath } from '../common.js';
import { store } from '../store.js';
import { signup } from '../actions/app.js';
import { BnbFormElement } from './bnb-form-element.js';
import './bnb-auth-form.js';

class BnbSignUp extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          @apply --layout-horizontal;
          @apply --layout-center-justified;
        }
      </style>
      <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="signupSubmitTapped">
      </iron-a11y-keys>

      <bnb-auth-form id="signup-form" name="signup" title="Sign up" buttons="[[signupButtons]]">

        <paper-input id="name" autofocus="true" label="Full name" type="text" value="{{fullname}}">
        </paper-input>

        <paper-input id="email" label="E-mail" type="email" value="{{email}}">
        </paper-input>

        <paper-input id="password" label="Password" autocomplete="off" type="password" value="{{password}}">
        </paper-input>

        <paper-input id="password_confirmation" label="Retype password" autocomplete="off" type="password" value="{{password_confirmation}}">
        </paper-input>

        <div class="actions">
          <paper-button on-tap="signupSubmitTapped">Sign me up</paper-button>
        </div>
      </bnb-auth-form>
    `;
  }
  static get is() { return 'bnb-signup'; }

  static get properties() {
    return {
      target: Object,
      fullname: {
        type: String,
        value: ''
      },
      email: {
        type: String,
        value: ''
      },
      password: {
        type: String,
        value: ''
      },
      password_confirmation: {
        type: String,
        value: ''
      },
      errors: {
        type: Object,
        observer: '_errorsChanged'
      },
      signupButtons: Array
    }
  }

  _stateChanged(state) {
    this.errors = state.app.errors;
  }

  ready() {
    super.ready();
    this.target = this.$['signup-form'];
    this.signupButtons = [{text:'Sign in', path:'/signin'}, {text:'Forgot your password', path:'/forgot-password'}];
  }

  signupSubmitTapped() {
    this.$['name'].invalid = false;
    this.$['email'].invalid = false;
    this.$['password'].invalid = false;
    this.$['password_confirmation'].invalid = false;

    store.dispatch(signup(this.fullname, this.email, this.password, this.password_confirmation, this._homeUrl()));
  }

  _homeUrl() {
    return getFullPath('');
  }
}

window.customElements.define(BnbSignUp.is, BnbSignUp);
