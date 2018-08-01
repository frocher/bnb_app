import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button';
import { getRequestUrl } from '../common';
import './bnb-common-styles';
import './bnb-divider';
import './bnb-icons';

class BnbOAuth extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      paper-button {
        text-transform:none;
      }

      paper-button span {
        padding-left: 2px;
      }

      bnb-divider {
      }

      .title {
        margin-bottom: 16px;
      }

      .title span {
        padding-left: 16px;
        padding-right: 16px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .facebook {
        background-color: var(--paper-indigo-500);
      }

      .github {
        background-color: var(--paper-grey-200);
        color: black;
      }

      .google {
        background-color: var(--paper-red-500);
      }
    </style>
    <div class="layout vertical center-justified">

      <div class="title layout horizontal center-justified center">
        <bnb-divider class="flex"></bnb-divider>
        <span>or log in using</span>
        <bnb-divider class="flex"></bnb-divider>
      </div>
      <div class="layout horizontal center-justified center">
        <paper-button on-tap="facebookTapped" class="facebook">
          <iron-icon icon="oauth:facebook"></iron-icon>
          <span>Facebook</span>
        </paper-button>
        <paper-button on-tap="githubTapped" class="github">
          <iron-icon icon="oauth:github"></iron-icon>
          <span>Github</span>
        </paper-button>
        <paper-button on-tap="googleTapped" class="google">
          <iron-icon icon="oauth:gplus"></iron-icon>
          <span>Google</span>
        </paper-button>
      </div>
    </div>
    `;
  }

  static get is() { return 'bnb-oauth'; }

  facebookTapped() {
    this._callService('facebook');
  }

  githubTapped() {
    this._callService('github');
  }

  googleTapped() {
    this._callService('google_oauth2');
  }

  _callService(service) {
    const origin = `${window.location.protocol}//${window.location.host}`;
    const url = getRequestUrl(`auth/${service}?auth_origin_url=${origin}`);
    window.location.replace(url);
  }
}

window.customElements.define(BnbOAuth.is, BnbOAuth);
