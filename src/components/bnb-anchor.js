import { PolymerElement, html } from '@polymer/polymer/polymer-element';

class BnbAnchor extends PolymerElement {
  static get template() {
    return html`
    <style>
      #anchor {
        cursor:pointer;
        text-decoration: none;

        color: var(--secondary-text-color);
      }

      #anchor:hover {
        text-decoration: underline;
      }

    </style>
    <a id="anchor" href="[[path]]">[[text]]</a>
    `;
  }

  static get properties() {
    return {
      text: String,
      path: String,
      params: Object,
    };
  }
}

window.customElements.define('bnb-anchor', BnbAnchor);
