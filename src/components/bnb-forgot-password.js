import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './bnb-auth-form.js';
import { store } from '../store.js';
import { forgotPassword } from '../actions/app.js';
import { getFullPath } from '../common.js';

class BnbForgotPassword extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }
    </style>

    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="submitTapped"></iron-a11y-keys>

    <bnb-auth-form id="forgot-form" title="Password forgotten" buttons="[[forgotButtons]]">
      <paper-input id="forgot-email" label="E-mail" type="email" value="{{email}}" autofocus="true">
      </paper-input>

      <div class="actions">
        <paper-button on-tap="submitTapped">Reset password</paper-button>
      </div>
    </bnb-auth-form>
    `;
  }

  static get is() { return 'bnb-forgot-password'; }

  static get properties() {
    return {
      target: Object,
      forgotButtons: Array,
      email: {
        type: String,
        value: ''
      }
    }
  }

  ready() {
    super.ready();
    this.target = this.$['forgot-form'];
    this.forgotButtons = [{text:'Sign up', path:'/signup'}, {text:'Sign in', path:'/signin'}];
  }

  submitTapped() {
    this.$['forgot-email'].isInvalid = false;
    store.dispatch(forgotPassword(this.email, getFullPath('edit-password')));
  }
}

window.customElements.define(BnbForgotPassword.is, BnbForgotPassword);
