import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import './bnb-common-styles.js';
import './bnb-period-dropdown.js';

class BnbPeriodBar extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        display: flex;
      }

      paper-card {
        width: 100%;
        margin: 16px;
        padding: 16px;
      }
    </style>
    <paper-card>
      <bnb-period-dropdown></bnb-period-dropdown>
    </paper-card>
    `;
  }
  static get is() { return 'bnb-period-bar'; }
}
window.customElements.define(BnbPeriodBar.is, BnbPeriodBar);
