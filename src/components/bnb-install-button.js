import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers';
import '@polymer/paper-button/paper-button';
import { store } from '../store';
import './bnb-common-styles';
import './bnb-period-dropdown';

class BnbInstallButton extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        display: flex;
      }
    </style>
    <paper-button style$="[[_computeStyle(displayButton)]]" on-tap="installTapped">Install Botnbot</paper-button>
    `;
  }

  static get properties() {
    return {
      promptEvent: {
        type: Object,
      },

      displayButton: {
        type: Boolean,
      },
    };
  }

  _stateChanged(state) {
    this.promptEvent = state.app.promptEvent;
    this.displayButton = this.promptEvent !== undefined;
  }

  _computeStyle(showMe) {
    return showMe ? 'display:block': 'display:none';
  }

  installTapped() {
    this.displayButton = false;
    this.promptEvent.prompt();
    this.promptEvent.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome !== 'accepted') {
        this.displayButton = true;
      }
    });
  }
}
window.customElements.define('bnb-install-button', BnbInstallButton);
