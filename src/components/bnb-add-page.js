import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers';
import { updateRoute, createPage } from '../actions/app.js';
import './bnb-common-styles.js';
import { BnbFormElement } from './bnb-form-element.js';

class BnbAddPage extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-vertical;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      #container {
        width:100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
      }
    </style>

    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="createTapped">
    </iron-a11y-keys>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="close" on-tap="closeTapped"></paper-icon-button>
          <span class="title">New page</span>
          <span class="flex"></span>
          <paper-button on-tap="createTapped">Create</paper-button>
        </app-toolbar>
      </app-header>
      <div id="content" class="fit">
        <div id="container">
          <paper-input id="name" label="Page name" value="{{pageName}}" autofocus="true"></paper-input>
          <paper-input id="url" label="URL" value="{{url}}"></paper-input>
        </div>
      </div>
    </app-header-layout>

    <paper-dialog id="discard_dlg" modal>
      <p>Discard new page.</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="closePage">Discard</paper-button>
      </div>
    </paper-dialog>
    `;
  }


  static get is() { return 'bnb-add-page'; }

  static get properties() {
    return {
      target: Object,
      pageName: String,
      url: String,
      routePath: {
        type: String,
        reflectToAttribute: true,
        observer: '_routePathChanged'
      },
      errors: {
        type: Object,
        observer: '_errorsChanged'
      }
    }
  }

  _stateChanged(state) {
    this.routePath = state.app.route;
    this.errors = state.app.errors;
  }

  ready() {
    super.ready();
    this.target = this.$.content;
  }

  closeTapped() {
    if (this.pageName !== '' || this.url !== '') {
      this.$.discard_dlg.open();
    }
    else {
      this.closePage();
    }
  }

  createTapped() {
    this.$['name'].invalid = false;
    this.$['url'].invalid = false;

    store.dispatch(createPage(this.pageName, this.url, this.handleResponse, this.handleError));
  }

  clearFields() {
    this.$['name'].invalid = false;
    this.$['url'].invalid = false;
    this.pageName = '';
    this.url = '';
  }

  closePage() {
    this.clearFields();
    store.dispatch(updateRoute('home'));
  }

  _routePathChanged(newVal, oldVal) {
    if (newVal === 'add-page') {
      this.clearFields();
    }
  }
}
window.customElements.define(BnbAddPage.is, BnbAddPage);
