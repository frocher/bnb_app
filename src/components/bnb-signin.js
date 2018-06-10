import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import { store } from '../store.js';
import { signin } from '../actions/app.js';
import './bnb-auth-form.js';
import './bnb-oauth.js';

class BnbSignIn extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }
    </style>

    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="signinSubmitTapped">
    </iron-a11y-keys>

    <bnb-auth-form id="signin-form" name="signin" title="Sign in" buttons="[[signinButtons]]">

      <paper-input label="E-mail" type="email" value="{{email}}" autofocus="true">
      </paper-input>

      <paper-input label="Password" autocomplete="off" type="password" value="{{password}}">
      </paper-input>

      <div class="actions">
        <paper-button on-tap="signinSubmitTapped">Log in</paper-button>
      </div>

      <bnb-oauth></bnb-oauth>

    </bnb-auth-form>
    `;
  }

  static get is() { return 'bnb-signin'; }

  static get properties() {
    return {
      credentials: {
        type: Object,
        observer: '_credentialsChanged'
      },

      email: String,
      password: String,

      target: Object,
      signinButtons: Array
    }
  }

  _stateChanged(state) {
    this.credentials = state.app.credentials;
  }

  ready() {
    super.ready();
    this.target = this.$['signin-form'];
    this.signinButtons = [{text:'Sign up', path:'/signup'}, {text:'Forgot your password', path:'/forgot-password'}];
  }

  signinSubmitTapped() {
    store.dispatch(signin(this.email, this.password));
  }

  _credentialsChanged() {
    this.email = '';
    this.password = '';
  }
}

window.customElements.define(BnbSignIn.is, BnbSignIn);
