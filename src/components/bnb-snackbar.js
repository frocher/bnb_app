import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class BnbSnackbar extends PolymerElement {

  static get template() {
    return html`
    <style>
    :host {
      display: block;
      position: fixed;
      left: calc(50% - 160px);
      right: calc(50% - 160px);
      bottom: 0;
      width: 320px;
      background-color: var(--app-nav-background-color);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      color: var(--app-nav-text-color);
      padding: 12px;
      visibility: hidden;
      text-align: center;
      will-change: transform;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
      transition-property: visibility, -webkit-transform;
      transition-property: visibility, transform;
      transition-duration: 0.2s;
    }

    :host(.opened) {
      visibility: visible;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    @media (max-width: 767px) {
      :host {
        left: 0;
        right: 0;
        width: auto;
      }
    }
    </style>

    <slot></slot>
    `;
  }

  static get is() { return 'bnb-snackbar'; }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'assertive');
  }

  open() {
    Polymer.dom.flush();
    this.removeAttribute('aria-hidden');
    this.offsetHeight && this.classList.add('opened');
    this._closeDebouncer = Polymer.Debouncer.debounce(this._closeDebouncer,
      Polymer.Async.timeOut.after(4000), () => {
        this.close();
      });
  }

  close() {
    this.setAttribute('aria-hidden', 'true');
    this.classList.remove('opened');
  }

}

customElements.define(BnbSnackbar.is, BnbSnackbar);
