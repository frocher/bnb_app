import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class BnbDivider extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: inline-block;
        height: 1px;
        min-height: 1px;
        max-height: 1px;
        background-color: var(--paper-divider-color, #000);
        opacity: 0.12;
        width: 100%;
        @apply --paper-divider;
      }
    </style>
    `;
  }
  static get is() { return 'bnb-divider'; }
}
window.customElements.define(BnbDivider.is, BnbDivider);
