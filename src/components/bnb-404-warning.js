
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import './bnb-anchor.js';

class Bnb404Warning extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      text-align: center;
      color: var(--app-secondary-color);
    }

    iron-icon {
      display: inline-block;
      width: 60px;
      height: 60px;
    }

    h1 {
      margin: 50px 0 50px 0;
      font-weight: 300;
    }
    </style>

    <div>
      <iron-icon icon="error"></iron-icon>
      <h1>Sorry, we couldn't find that page</h1>
    </div>
    <bnb-anchor text="Go to the home page" path="/home"></bnb-anchor>
    `;
  }
  static get is() { return 'bnb-404-warning'; }
}

customElements.define(Bnb404Warning.is, Bnb404Warning);

